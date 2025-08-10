// Fetch book data from API
async function fetchBooks() {
    const response = await fetch('https://prisma-book-reviews.onrender.com/api/books');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export { fetchBooks }