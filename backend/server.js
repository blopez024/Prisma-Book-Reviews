const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/data', async (req, res) => {
    try {
        const data = await prisma.author.findMany();
        return res.json(data);
    } catch (error) {
        console.error('Error fetching data: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(5555, () => {
    console.log('server listening on port 5555');
});
