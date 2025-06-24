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
    const firstId = getRandomElement(genres).id;
    let secondId = getRandomElement(genres).id;

    while (firstId === secondId) {
        secondId = getRandomElement(genres).id;
    }

    return { firstId: firstId, secondId: secondId };
}

// Create Authors
async function createAuthors(count = 5) {
    const authors = [];

    for (let i = 0; i < count; i++) {
        const author = await prisma.author.create({
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
async function createGenres(low = 10, high = 15) {
    const genres = [];
    const bookGenres = [];
    // Determine number of genres: 10 - 15
    const genreCount = faker.number.int({ min: low, max: high });

    // Loop to create genres until we reach the desired count
    while (bookGenres.length < genreCount) {
        const bookGenre = faker.book.genre();

        // Only create the genre if it's not already in the bookGenres array
        if (!bookGenres.includes(bookGenre)) {
            const genre = await prisma.genre.create({
                data: {
                    name: bookGenre,
                },
            });

            genres.push(genre);
            bookGenres.push(bookGenre);
            console.log(`Created genre: ${genre.name}`);
        }
    }

    return genres;
}

// Create Users
async function createUsers(count = 15) {
    const users = [];

    for (let i = 0; i < count; i++) {
        const user = await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            },
        });

        users.push(user);
        console.log(`Created user: ${user.name}`);
    }

    return users;
}

// Create Reviews
async function createReviews(userId, bookId, low = 1, high = 3) {
    // Determine number of review: 1 - 3
    const reviewCount = faker.number.int({ min: low, max: high });
    for (let j = 0; j < reviewCount; j++) {
        // Random rating between 1 - 5
        const rating = faker.number.int({ min: 1, max: 5 });

        const review = await prisma.review.create({
            data: {
                userId: userId,
                rating: rating,
                content: faker.lorem.paragraphs(2),
                recommend: rating > 2 ? 'YES' : 'NO',
                date: faker.date.recent({ days: 10 }),
                bookId: bookId,
            },
        });
        console.log(`Created review: ${review.rating}/5`);
    }
}

// Create Books for the given author
async function createBooks(author, genres, users, low = 2, high = 3) {
    // Determine number of books to add: 2 - 3
    const bookCount = faker.number.int({ min: low, max: high });

    for (let i = 0; i < bookCount; i++) {
        const price = faker.number.int({ min: 5, max: 25, multipleOf: 5 }) - 0.01;
        // Get two random & unique genre IDs for the book
        const genreIds = getGenreIds(genres);

        const book = await prisma.book.create({
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

        const userId = getRandomElement(users).id;
        await createReviews(userId, book.id);
    }
}

async function main() {
    // Clean existing data
    await prisma.review.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.author.deleteMany();

    // Create 5 authors
    const authors = await createAuthors();

    // Create between 10 - 15 unique Genres
    const genres = await createGenres(); //[];

    // Create 15 Users
    const users = await createUsers();

    // Each author has between 2 - 3 books
    for (const author of authors) {
        await createBooks(author, genres, users);
    }
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
