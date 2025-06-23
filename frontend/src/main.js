const dataContainer = document.getElementById('app');

async function fetchAndDisplayData() {
  try {
    // Show loading state
    dataContainer.textContent = 'Loading data...';
    // Fetch data from your Express API
    const response = await fetch('http://localhost:5555/api/getBooks');
    if (!response.ok) {
      console.log(`response not okay`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    console.table(data);

    // Display the data
    if (data.length === 0) {
      dataContainer.textContent = 'No data found';
      return;
    }

    // Book
    /**
     * Image  Book Title
     *        by Author Name
     *        Book Rating
     * 
     *        Description of Book
     * 
     *        Book Reviews
     * 
     * 
     * About the Author
     * Name, Age, Bio, Books Written
     */

    // Create HTML for the data
    const html = `
    <ul>
        ${data
        .map(
          (author) => `
            <li>
                <h2>${author.name}</h2>
                <strong>Bio: </strong>${author.bio}<br>
                <strong>Email: </strong>${author.books}<br>
            </li>`,
        )
        .join('')}
    </ul>
    `;

    dataContainer.innerHTML = html;
  } catch (error) {
    // ... Error Handling goes here
    console.error('Error:', error);
    dataContainer.textContent =
      'Failed to load data. Check console for details.';
  }
}

// Fetch and display data when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayData);
