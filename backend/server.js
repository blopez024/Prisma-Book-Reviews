const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/books', async (req, res) => {
    try {
        const books = await prisma.book.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                isbn: true,
                price: true,
                author: {
                    select: {
                        name: true,
                    },
                },
                genres: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to load books' });
    }
});

app.get('/api/getBooks', async (req, res) => {
    try {
        const data = await prisma.book.findMany({
            include: {
                author: true,
                reviews: {
                    include: {
                        author: true,
                    },
                },
            },
        });
        return res.json(data);
    } catch (error) {
        console.error('Error fetching author data: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(5555, () => {
    console.log('server listening on port 5555');
});
