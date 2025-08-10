import { displayRating } from "../utils/rating";

function renderPricing(price) {
  const priceNum = parseFloat(price);

  return `
    <div class="pricing">
      <div class="price-card">
        <h3>eBook</h3>
        <p>$${(priceNum - 1).toFixed(2)}</p>
      </div>
      <div class="price-card">
        <h3>Audiobook</h3>
        <p>$${priceNum.toFixed(2)}</p>
      </div>
      <div class="price-card">
        <h3>Paperback</h3>
        <p>$${priceNum.toFixed(2)}</p>
      </div>
      <div class="price-card">
        <h3>Hardcover</h3>
        <p>$${(priceNum + 10).toFixed(2)}</p>
      </div>
    </div>
  `;
}

function renderGenres(genre1, genre2) {
  return `
    <div class="genre-grid">
      <div class="genre-card" style="background-color:${genre1.color};">
        <span>${genre1.emoji}</span>
        <p>${genre1.name}</p>
      </div>
      <div class="genre-card" style="background-color:${genre2.color};">
        <span>${genre2.emoji}</span>
        <p>${genre2.name}</p>
      </div>
    </div>
  `;
}

function renderBookDescription(description) {
  return `
    <div class="book-description">
      '${description}'
    </div>
  `;
}

function renderBookInfo(book, rating, genre1, genre2) {
  return `
    <div class="book-info">
      <div>
        <h2>${book.title}</h2>
        <p class="author-name">by ${book.author.name}</p>
        <p class="rating">${displayRating(rating)} (${book.reviews.length} Reviews)</p>
        <hr />
        ${renderPricing(book.price)}
        ${renderGenres(genre1, genre2)}
        <hr />
        ${renderBookDescription(book.description)}
      </div>
    </div>
  `;
}

export { renderBookInfo }