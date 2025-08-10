const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

// Initialize Prisma Client
const prisma = new PrismaClient();

// Get a random element from an array (Genre or User)
function getRandomElement(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

// Return two unique genre IDs
function getGenreIds(genres) {
    const shuffled = [...genres].sort(() => Math.random() - 0.5);
    const [firstId, secondId] = [shuffled[0].id, shuffled[1].id];

    return { firstId, secondId };
}

// Create Authors
async function createAuthors(prismaClient = prisma, count = 5) {
    const authors = [];

    for (let i = 0; i < count; i++) {
        const author = await prismaClient.author.create({
            data: {
                name: `${faker.person.prefix()} ${faker.book.author()}`,
                bio: faker.person.bio(),
                age: faker.number.int({ min: 20, max: 60 }),
            },
        });

        authors.push(author);
        console.log(`Created Author: ${author.name}`);
    }

    return authors;
}

// Create unique Book Genres
async function createGenres(prismaClient = prisma, low = 10, high = 15) {
    // Determine number of genres: 10 - 15
    const genreCount = faker.number.int({ min: low, max: high });
    // Use a Set to store unique genre names
    const uniqueGenres = new Set();

    // Loop until the Set has the desired number of unique genres
    while (uniqueGenres.size < genreCount) {
        uniqueGenres.add(faker.book.genre());
    }

    // Convert Set to an array of objects with the shape: { name: genre }
    const genreData = Array.from(uniqueGenres).map((name) => ({ name }));

    // Insert all genre objects into the database using Prisma
    await prismaClient.genre.createMany({ data: genreData });
    console.log(`Created ${genreData.length} genres.`);

    // Return all genres from the database
    return prismaClient.genre.findMany();
}

// Create Users
async function createUsers(prismaClient = prisma, count = 20) {
    const usersData = [];

    for (let i = 0; i < count; i++) {
        // Just prepare the data, don't await the creation yet
        usersData.push({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        });
    }

    // Insert all users in a single database query
    await prismaClient.user.createMany({
        data: usersData,
    });

    console.log(`Created ${count} users`);

    // Fetch the users to get their generated IDs for later use
    return prismaClient.user.findMany();
}

// Create Review
async function createReview(userId, bookId, prismaClient = prisma) {
    // Random rating between 1 - 5
    const rating = faker.number.int({ min: 1, max: 5 });

    const review = await prismaClient.review.create({
        data: {
            userId: userId,
            rating: rating,
            content: faker.lorem.paragraphs(2),
            recommend: rating > 2 ? 'YES' : 'NO',
            date: faker.date.recent({ days: 30 }),
            bookId: bookId,
        },
    });
    console.log(
        `Created review with rating: ${review.rating}/5 by user ID: ${userId}`,
    );
}

// Create Books for the given author
async function createBooks(
    author,
    genres,
    users,
    prismaClient = prisma,
    low = 2,
    high = 3,
) {
    // Determine number of books to add: 2 - 3
    const bookCount = faker.number.int({ min: low, max: high });

    for (let i = 0; i < bookCount; i++) {
        const price = faker.number.int({ min: 5, max: 25, multipleOf: 5 }) - 0.01;
        // Get two random & unique genre IDs for the book
        const genreIds = getGenreIds(genres);

        const book = await prismaClient.book.create({
            data: {
                title: faker.book.title(),
                description: faker.lorem.paragraphs(),
                isbn: faker.commerce.isbn(13),
                price: price,
                authorId: author.id,
                // https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/many-to-many-relations#relational-databases
                genres: {
                    connect: [{ id: genreIds.firstId }, { id: genreIds.secondId }],
                },
            },
        });
        console.log(`Created book: ${book.title}`);

        // Create multiple review from different users for this book
        const numOfReviews = faker.number.int({ min: 3, max: 5 });
        for (let j = 0; j < numOfReviews; j++) {
            // Get a new random user for each review
            const randomUser = getRandomElement(users);
            await createReview(randomUser.id, book.id, prismaClient);
        }
    }
}

async function main() {
    // Clean existing data
    await prisma.review.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.author.deleteMany();

    // Wrap all write operation in a transaction
    await prisma.$transaction(async (tx) => {
        // Create 5 authors
        const authors = await createAuthors(tx);

        // Create between 10 - 15 unique Genres
        const genres = await createGenres(tx);

        // Create 20 Users
        const users = await createUsers(tx);

        // Each author has between 2 - 3 books
        for (const author of authors) {
            await createBooks(author, genres, users, tx);
        }
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
