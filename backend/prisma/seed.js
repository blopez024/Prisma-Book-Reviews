const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
    // Clean existing data
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    // Create 5 users
    const users = [];
    for (let i = 0; i < 5; i++) {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                name: faker.person.fullName(),
                role: i === 0 ? 'ADMIN' : i === 1 ? 'EDITOR' : 'USER',
            },
        });
        users.push(user);
        console.log(`Created user: ${user.name}`);
    }

    // Each user creates 2-4 posts
    for (const user of users) {
        const postCount = faker.number.int({ min: 2, max: 4 });
        for (let i = 0; i < postCount; i++) {
            const post = await prisma.post.create({
                data: {
                    title: faker.lorem.sentence(),
                    content: faker.lorem.paragraphs(3),
                    published: faker.datatype.boolean(),
                    authorId: user.id,
                },
            });
            console.log(`Created post: ${post.title}`);

            // Add 1-3 comments to each post from random users
            const commentCount = faker.number.int({ min: 1, max: 3 });
            for (let j = 0; j < commentCount; j++) {
                const randomUser =
                    users[faker.number.int({ min: 0, max: users.length - 1 })];
                await prisma.comment.create({
                    data: {
                        text: faker.lorem.sentence(),
                        postId: post.id,
                        authorId: randomUser.id,
                    },
                });
                console.log(`Added comment to post ${post.id}`);
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
