import { emojis } from "./data/emoji";

const dataContainer = document.getElementById('app');

function averageRating(reviews) {
  let sum = 0;
  for (let i = 0; i < reviews.length; i++) {
    sum += reviews[i].rating;
  }
  return Math.floor(sum / reviews.length);
}

function displayRating(star) {
  switch (star) {
    case 5:
      return '⭐⭐⭐⭐⭐';
    case 4:
      return '⭐⭐⭐⭐⚝';
    case 3:
      return '⭐⭐⭐⚝⚝';
    case 2:
      return '⭐⭐⚝⚝⚝';
    default:
      return '⭐⚝⚝⚝⚝';
  }
}

async function fetchAndDisplayData() {
  try {
    // Show loading state
    // dataContainer.textContent = 'Loading data...';
    // Fetch data from your Express API
    const response = await fetch('http://localhost:5555/api/books');
    if (!response.ok) {
      console.log(`response not okay`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log(data);
    // console.table(data);

    // Display the data
    if (data.length === 0) {
      dataContainer.textContent = 'No data found';
      return;
    }


    let html = '';

    data.map((book) => {
      const info = {
        id: book.id,
        title: book.title,
        description: book.description,
        isbn: book.isbn,
        price: book.price,
        author: book.author.name,
        genre1: book.genres[0].name,
        genre2: book.genres[1].name,
        reviews: book.reviews,
      };

      // console.log(info.reviews.length)
      const rating = averageRating(info.reviews)

      const colorStart = emojis[info.genre1].color;
      const colorEnd = emojis[info.genre2].color;

      const emoji1 = emojis[info.genre1].emoji;
      const emoji2 = emojis[info.genre2].emoji;


      html += `
      <div class="book-details">
        <div class="book-cover" style="background: linear-gradient(to bottom right, ${colorStart}, ${colorEnd});">
          <div class="title">${info.title}</div>
          <div class="author">by ${info.author}</div>
        </div>
        <div class="book-info">
          <div>
            <h2>${info.title}</h2>
            <p class="author-name">by ${info.author}</p>
            <p class="rating">${displayRating(rating)} (${info.reviews.length})</p>
            <hr />
            <div class="pricing">
              <div class="price-card">
                <h3>eBook</h3>
                <p>$${info.price - 1}</p>
              </div>
              <div class="price-card">
                <h3>Audiobook</h3>
                <p>$${info.price}</p>
              </div>
              <div class="price-card">
                <h3>Paperback</h3>
                <p>$${info.price}</p>
              </div>
              <div class="price-card">
                <h3>Hardcover</h3>
                <p>$${parseInt(info.price) + 10}</p>
              </div>
            </div>
            <div class="genre-grid">
              <div class="genre-card" style="background-color:${colorStart};">
                <span>${emoji1}</span>
                <p>${info.genre1}</p>
              </div>
              <div class="genre-card" style="background-color:${colorEnd};">
                <span>${emoji2}</span>
                <p>${info.genre2}</p>
              </div>
            </div>
            <hr />
            <div class="book-description">
              '${info.description}'
            </div>
          </div>
        </div>
      </div>
      `;
    });

    // Append HTML to DOM
    document.getElementById('app').innerHTML = html;


  } catch (error) {
    // ... Error Handling goes here
    console.error('Error:', error);
    dataContainer.textContent =
      'Failed to load data. Check console for details.';
  }
}

// Fetch and display data when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayData);
