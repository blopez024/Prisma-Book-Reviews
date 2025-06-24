const dataContainer = document.getElementById('app');

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

    // let html = '';
    // data.map((book) => {
    //   const info = {
    //     id: book.id,
    //     title: book.title,
    //     description: book.description,
    //     isbn: book.isbn,
    //     price: book.price,
    //     author: book.author.name,
    //     genre1: book.genres[0].name,
    //     genre2: book.genres[1].name
    //   }

    // })
    // const bookList = document.getElementById("app");

    // console.log(bookList)
    // data.map((book) => {
    //   const info = {
    //     id: book.id,
    //     title: book.title,
    //     description: book.description,
    //     isbn: book.isbn,
    //     price: book.price,
    //     author: book.author.name,
    //     genre1: book.genres[0]?.name || "N/A",
    //     genre2: book.genres[1]?.name || "N/A"
    //   };


    //   const bookDiv = document.createElement("div");
    //   bookDiv.className = "book";
    //   bookDiv.innerHTML = `
    //     <h2>${info.title}</h2>
    //     <p><strong>Author:</strong> ${info.author}</p>
    //     <p><strong>Description:</strong> ${info.description}</p>
    //     <p><strong>ISBN:</strong> ${info.isbn}</p>
    //     <p><strong>Price:</strong> ${info.price}</p>
    //     <p><strong>Genres:</strong> ${info.genre1}, ${info.genre2}</p>
    //   `;

    //   bookList.appendChild(bookDiv);
    // });

  } catch (error) {
    // ... Error Handling goes here
    console.error('Error:', error);
    dataContainer.textContent =
      'Failed to load data. Check console for details.';
  }
}

// Fetch and display data when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayData);
