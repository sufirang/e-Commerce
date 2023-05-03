
// Retrieve HTML elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const bookList = document.getElementById('book-list');
const historyList = document.getElementById('history-list');
const clearHistoryButton = document.getElementById('clear-history-button');

// Retrieve search history from localStorage
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Display search history on the page
function displaySearchHistory() {
  historyList.innerHTML = '';
  for (let i = searchHistory.length - 1; i >= 0; i--) {
    const historyItem = document.createElement('li');
    historyItem.classList.add('history-item');
    historyItem.textContent = searchHistory[i];
    historyItem.addEventListener('click', () => {
      searchInput.value = searchHistory[i];
      searchBooks();
    });
    historyList.appendChild(historyItem);
  }
}

displaySearchHistory();

// Add search query to search history and update localStorage
function addSearchQueryToHistory(query) {
  if (!searchHistory.includes(query)) {
    searchHistory.push(query);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    displaySearchHistory();
  }
}

// Clear search history and update localStorage
function clearSearchHistory() {
  searchHistory = [];
  localStorage.removeItem('searchHistory');
  displaySearchHistory();
}

// Fetch books from the Google Books API
async function fetchBooks(query) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.items || [];
}

// Display books on the page
function displayBooks(books) {
  bookList.innerHTML = '';
  books.forEach(book => {
    const bookItem = document.createElement('li');
    bookItem.classList.add('book');
    bookItem.innerHTML = `
      <img src="${book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/100x150.png?text=No+Image'}" alt="${book.volumeInfo.title}">
      <div class="book-info">
        <h3 class="book-title">${book.volumeInfo.title}</h3>
        <p class="book-author">By ${book.volumeInfo.authors?.join(', ') || 'Unknown'}</p>
        <p class="book-description">${book.volumeInfo.description || ''}</p>
      </div>
    `;
    bookList.appendChild(bookItem);
  });
}

// Search for books
function searchBooks() {
  const query = searchInput.value.trim();
  if (query) {
    fetchBooks(query).then(books => {
      displayBooks(books);
      addSearchQueryToHistory(query);
    });
  }
}

// Event listeners
searchForm.addEventListener('submit', event => {
  event.preventDefault();
  searchBooks();
});

clearHistoryButton.addEventListener('click', clearSearchHistory);