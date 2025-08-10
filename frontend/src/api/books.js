// Fetch book data from API
async function fetchBooks() {
    const response = await fetch('http://localhost:5555/api/books');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export { fetchBooks }