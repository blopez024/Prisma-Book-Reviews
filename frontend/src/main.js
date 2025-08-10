import { fetchBooks } from './api/books.js';
import { renderBooks } from './components/books.js';
import { showLoading, hideLoading } from './components/loading.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    showLoading();
    const books = await fetchBooks();
    renderBooks(books);
  } catch (error) {
    console.error(error);
    const dataContainer = document.getElementById('app');
    dataContainer.textContent =
      'Failed to load data. Check console for details.';
  } finally {
    // hideLoading();
  }
});
