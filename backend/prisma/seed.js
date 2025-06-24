const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
    // Clean existing data

    await prisma.review.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.author.deleteMany();

    // Create 5 authors
    const authors = [];
    for (let i = 0; i < 5; i++) {
        const author = await prisma.author.create({
            data: {
                name: `${faker.person.prefix()} ${faker.book.author()}`,
                bio: faker.person.bio(),
                age: faker.number.int({ min: 20, max: 60 }),
            },
        });
        authors.push(author);
        console.log(`Created author: ${author.name}`);
    }

    // Create between 5 - 10 unique Genres
    const genres = [];
    const genreCount = faker.number.int({ min: 5, max: 10 });
    for (let i = 0; i < genreCount; i++) {
        const bookGenre = faker.book.genre();
        if (genres.includes(bookGenre)) {
            continue;
        }

        const genre = await prisma.genre.create({
            data: {
                name: bookGenre,
            },
        });

        genres.push(genre);
        console.log(`Created genre: ${genre.name}`);
    }

    // Create 15 Users
    const users = [];
    for (let i = 0; i < 15; i++) {
        const user = await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password()
            }
        })

        users.push(user);
        console.log(`Created user: ${user.name}`);
    }

    // Each author creates between 2 - 3 books
    // Total of: 10 - 15 books
    for (const author of authors) {
        const bookCount = faker.number.int({ min: 2, max: 3 });
        for (let i = 0; i < bookCount; i++) {
            const genreIndex = Math.floor(Math.random() * genres.length);
            const price = faker.number.int({ min: 5, max: 25, multipleOf: 5 }) - 1 + 0.99;

            const book = await prisma.book.create({
                data: {
                    title: faker.book.title(),
                    description: faker.lorem.paragraphs(),
                    isbn: faker.commerce.isbn(13),
                    genre: {
                        connect: {
                            id: genres[genreIndex].id
                        }
                    },
                    price: price,
                    authorId: author.id,
                },
            });
            console.log(`Created book: ${book.title}`);

            // Add between 1 - 3 reviews to each book from random users
            // Total of 10 - 45 reviews
            const reviewCount = faker.number.int({ min: 1, max: 3 });
            let userIndex = 0;
            for (let j = 0; j < reviewCount; j++) {
                const rating = faker.number.int({ min: 1, max: 5 });

                if (userIndex >= 15) {
                    userIndex = 0;
                }
                const user = users[userIndex++];

                const review = await prisma.review.create({
                    data: {
                        userId: user.id,
                        rating: rating,
                        content: faker.lorem.paragraphs(2),
                        recommend: rating > 2 ? 'YES' : 'NO',
                        date: faker.date.recent({ days: 10 }),
                        bookId: book.id,
                    },
                });
                console.log(`Created review: ${review.rating}/5`);
            }
        }
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
