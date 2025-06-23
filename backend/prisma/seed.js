const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
    // Clean existing data
    await prisma.review.deleteMany();
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();

    // Create 5 authors
    const authors = [];
    for (let i = 0; i < 5; i++) {
        const author = await prisma.author.create({
            data: {
                name: faker.book.author(),
                avatar: faker.image.avatar(),
                bio: faker.person.bio(),
                age: faker.number.int({ min: 20, max: 60 }),
                sex: i % 2 ? 'MALE' : 'FEMALE',
            },
        });
        authors.push(author);
        console.log(`Created author: ${author.name}`);
    }

    // Each author creates 3-4 books
    for (const author of authors) {
        const bookCount = faker.number.int({ min: 3, max: 4 });
        for (let i = 0; i < bookCount; i++) {
            const book = await prisma.book.create({
                data: {
                    title: faker.book.title(),
                    description: faker.lorem.paragraph(),
                    isbn: faker.commerce.isbn(13),
                    genre: faker.book.genre(),
                    price: faker.number.int({ min: 5, max: 25, multipleOf: 5 }) - 1 + 0.99,
                    authorId: author.id,
                },
            });
            console.log(`Created book: ${book.title}`);

            // Add 1-3 reviews to each book from random users
            const reviewCount = faker.number.int({ min: 1, max: 3 });
            for (let j = 0; j < reviewCount; j++) {
                const randomAuthor =
                    authors[faker.number.int({ min: 0, max: authors.length - 1 })];
                const rating = faker.number.int({ min: 1, max: 5 });
                await prisma.review.create({
                    data: {
                        user: faker.person.fullName(),
                        rating: rating,
                        recommend: rating > 2 ? "YES" : "NO",
                        content: faker.lorem.paragraph(2),
                        date: faker.date.recent({ days: 10 }),
                        bookId: book.id,
                        authorId: randomAuthor.id,
                    },
                });
                console.log(`Added review to book ${book.id}`);
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
