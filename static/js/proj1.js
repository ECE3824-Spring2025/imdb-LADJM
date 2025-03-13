// Array to store favorite movies
let favoriteMovies = [];

// Function to fetch movies from the Flask API
async function fetchMovies() {
    try {
        const response = await fetch('/movies');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.movies;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}

// Function to load content based on genre
async function loadContent() {
    const genre = document.getElementById('genre').value;
    const contentListVotes = document.getElementById('content-list-votes');
    const contentListRating = document.getElementById('content-list-rating');
    const loading = document.getElementById('loading'); // Get the loading indicator

    // Show loading indicator
    loading.style.display = 'block'; // Show the loading indicator
    contentListVotes.innerHTML = '';
    contentListRating.innerHTML = '';

    const movies = await fetchMovies();

    if (genre && movies.length > 0) {
        const filteredMovies = movies.filter(movie => movie.genre === genre);

        // Clear previous content
        contentListVotes.innerHTML = '';
        contentListRating.innerHTML = '';

        // Sort by votes (descending)
        const sortedByVotes = [...filteredMovies].sort((a, b) => {
            const votesA = a.votes ? parseInt(a.votes.replace(/[^\d]/g, '')) : 0;
            const votesB = b.votes ? parseInt(b.votes.replace(/[^\d]/g, '')) : 0;
            return votesB - votesA;
        });

        // Sort by rating (descending)
        const sortedByRating = [...filteredMovies].sort((a, b) => {
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            return ratingB - ratingA;
        });

        // Display top 10 movies by votes
        sortedByVotes.slice(0, 10).forEach(movie => {
            const movieElement = createMovieElement(movie);
            contentListVotes.appendChild(movieElement);
        });

        // Display top 10 movies by rating
        sortedByRating.slice(0, 10).forEach(movie => {
            const movieElement = createMovieElement(movie);
            contentListRating.appendChild(movieElement);
        });
    } else {
        contentListVotes.innerHTML = '<p>Please select a genre to see the top content.</p>';
        contentListRating.innerHTML = '';
    }

    // Hide loading indicator
    loading.style.display = 'none'; // Hide the loading indicator
}

// Function to create a movie element
function createMovieElement(movie) {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie-item');
    movieElement.innerHTML = `
        <img src="${movie.image}" alt="${movie.name}" class="movie-image">
        <h3>${movie.name}</h3>
        <p>Votes: ${movie.votes || 'N/A'}</p>
        <p>Rating: ${movie.rating || 'N/A'}</p>
        <button onclick="addToFavorites('${movie.id}', '${movie.name}')">Add to Favorites</button>
    `;
    return movieElement;
}

// Function to add a movie to favorites
function addToFavorites(id, name) {
    if (!favoriteMovies.some(movie => movie.id === id)) {
        favoriteMovies.push({ id, name });
        alert(`${name} added to favorites!`);
        updateFavoritesList();
    } else {
        alert(`${name} is already in your favorites!`);
    }
}

// Function to update the favorites list displayed on the page
function updateFavoritesList() {
    const favoritesList = document.getElementById('favorites-list');
    if (favoritesList) {
        favoritesList.innerHTML = '<h2>My Favorites</h2>';
        if (favoriteMovies.length > 0) {
            favoriteMovies.forEach(movie => {
                const favoriteItem = document.createElement('div');
                favoriteItem.classList.add('favorite-item');
                favoriteItem.innerHTML = `
                    <h3>${movie.name}</h3>
                    <button onclick="removeFromFavorites('${movie.id}')">Remove</button>
                `;
                favoritesList.appendChild(favoriteItem);
            });
        } else {
            favoritesList.innerHTML += '<p>No favorites added yet.</p>';
        }
    }
}

// Function to remove a movie from favorites
function removeFromFavorites(id) {
    favoriteMovies = favoriteMovies.filter(movie => movie.id !== id);
    updateFavoritesList();
    alert('Movie removed from favorites!');
}

// Initialize favorites list on page load
document.addEventListener('DOMContentLoaded', () => {
    const favoritesSection = document.createElement('div');
    favoritesSection.id = 'favorites-list';
    document.body.appendChild(favoritesSection);
    updateFavoritesList();

    // Load content on page load
    loadContent();
});