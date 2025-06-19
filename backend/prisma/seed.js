const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
    // Clean existing data
    await prisma.author.deleteMany();
    await prisma.book.deleteMany();
    await prisma.review.deleteMany();

    // Create 5 authors
    const authors = [];
    for (let i = 0; i < 5; i++) {
        const author = await prisma.author.create({
            data: {
                name: faker.book.author(),
                bio: faker.person.bio(),
            },
        });
        authors.push(author);
        console.log(`Created author: ${author.name}`);
    }

    // Each author creates 2-4 books
    for (const author of authors) {
        const bookCount = faker.number.int({ min: 2, max: 4 });
        for (let i = 0; i < bookCount; i++) {
            const book = await prisma.book.create({
                data: {
                    title: faker.book.title(),
                    isbn: faker.commerce.isbn(13),
                    authorId: author.id,
                },
            });
            console.log(`Created book: ${book.title}`);

            // Add 1-3 reviews to each book from random authors
            const reviewCount = faker.number.int({ min: 1, max: 3 });
            for (let j = 0; j < reviewCount; j++) {
                const randomAuthor =
                    authors[faker.number.int({ min: 0, max: authors.length - 1 })];
                await prisma.review.create({
                    data: {
                        content: faker.lorem.paragraph(),
                        rating: faker.int({ min: 1, max: 5 }),
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
