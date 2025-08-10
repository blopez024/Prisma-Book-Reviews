import { averageRating } from '../utils/rating.js';
import { safeGenreData } from '../utils/formatGenre.js';

import { renderBookCover } from './bookCover.js';
import { renderBookInfo } from './bookInfo.js';

const dataContainer = document.getElementById('app');

function renderBooks(books) {
  if (books.length === 0) {
    dataContainer.textContent = 'No data found';
    return;
  }

  const html = books
    .map((book) => {
      const rating = averageRating(book.reviews);
      const [rawGenre1, rawGenre2] = book.genres;
      const genre1 = safeGenreData(rawGenre1);
      const genre2 = safeGenreData(rawGenre2);


      return `
      <div class="book-details">
        ${renderBookCover(
        book.title,
        book.author.name,
        genre1.color,
        genre2.color,
      )}
        ${renderBookInfo(book, rating, genre1, genre2)}
      </div>
    `;
    })
    .join('');

  dataContainer.innerHTML = html;
}

export { renderBooks };
