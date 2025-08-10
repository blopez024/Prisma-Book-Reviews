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
                reviews: {
                    select: {
                        rating: true,
                    },
                },
            },
        });

        return res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Failed to load books' });
    }
});

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`);
});
