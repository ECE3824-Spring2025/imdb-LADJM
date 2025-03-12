const data = {
    "Action": [
        {"id": "tt0468569", "name": "The Dark Knight", "rating": 9.0, "votes": "2.7M", "image": "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg"},
        {"id": "tt1375666", "name": "Inception", "rating": 8.8, "votes": "2.5M", "image": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg"},
        {"id": "tt0080684", "name": "Star Wars: Episode V - The Empire Strikes Back", "rating": 8.7, "votes": "1.4M", "image": "https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"},
        {"id": "tt0133093", "name": "The Matrix", "rating": 8.7, "votes": "2.0M", "image": "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg"},
        {"id": "tt8579674", "name": "1917", "rating": 8.2, "votes": "600K", "image": "https://m.media-amazon.com/images/M/MV5BOTdmNTFjNDEtNzg0My00ZjkxLTg1ZDAtZTdkMDc2ZmFiNWQ1XkEyXkFqcGdeQXVyNTAzNzgwNTg@._V1_.jpg"},
        {"id": "tt0364569", "name": "Oldboy", "rating": 8.3, "votes": "500K", "image": "https://m.media-amazon.com/images/M/MV5BMTI3NTQyMzU5M15BMl5BanBnXkFtZTcwMTM2MjgyMQ@@._V1_.jpg"},
        {"id": "tt0082971", "name": "Raiders of the Lost Ark", "rating": 8.4, "votes": "1.0M", "image": "https://m.media-amazon.com/images/M/MV5BNTU2ODkyY2MtMjU1NC00NjE1LWEzYjgtMWQ3MzRhMTE0NDc0XkEyXkFqcGdeQXVyMjM4MzQ4OTQ@._V1_.jpg"},
        {"id": "tt0172495", "name": "Gladiator", "rating": 8.5, "votes": "1.7M", "image": "https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg"},
        {"id": "tt0103064", "name": "Terminator 2: Judgment Day", "rating": 8.6, "votes": "1.2M", "image": "https://m.media-amazon.com/images/M/MV5BMGU2NzRmZjUtOGUxYS00ZjdjLWEwZWItY2NlM2JhNjkxNTFmXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg"},
        {"id": "tt0047478", "name": "Seven Samurai", "rating": 8.6, "votes": "400K", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Seven_Samurai_poster.jpg/1200px-Seven_Samurai_poster.jpg"}
    ],
    "Comedy": [
        {"id": "tt0118799", "name": "Life Is Beautiful", "rating": 8.6, "votes": "700K", "image": "https://m.media-amazon.com/images/M/MV5BYmJmM2Q4NmMtYThmNC00ZjRlLWEyZmItZTIwOTBlZDQ3NTQ1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg"},
        {"id": "tt0088763", "name": "Back to the Future", "rating": 8.5, "votes": "1.3M", "image": "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg"},
        {"id": "tt6966692", "name": "Green Book", "rating": 8.2, "votes": "500K", "image": "https://m.media-amazon.com/images/M/MV5BYzIzYmJlYTYtNGNiYy00N2EwLTk4ZjItMGYyZTJiOTVkM2RlXkEyXkFqcGdeQXVyODY1NDk1NjE@._V1_.jpg"},
        {"id": "tt0120735", "name": "Lock, Stock and Two Smoking Barrels", "rating": 8.1, "votes": "600K", "image": "https://m.media-amazon.com/images/M/MV5BMTAyN2JmZmEtNjAyMy00NzYwLThmY2MtYWQ3OGNhNjExMmM4XkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_.jpg"},
        {"id": "tt2096673", "name": "Inside Out", "rating": 8.1, "votes": "800K", "image": "https://m.media-amazon.com/images/M/MV5BOTgxMDQwMDk0OF5BMl5BanBnXkFtZTgwNjU5OTg2NDE@._V1_.jpg"},
        {"id": "tt5027774", "name": "Three Billboards Outside Ebbing, Missouri", "rating": 8.1, "votes": "550K", "image": "https://m.media-amazon.com/images/M/MV5BMjI0ODcxNzM1N15BMl5BanBnXkFtZTgwMzIwMTEwNDI@._V1_.jpg"},
        {"id": "tt0208092", "name": "Snatch", "rating": 8.2, "votes": "900K", "image": "https://m.media-amazon.com/images/M/MV5BMTA2NDYxOGYtYjU1Mi00Y2QzLTgxMTQtMWI1MGI0ZGQ5MmU4XkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_.jpg"},
        {"id": "tt0993846", "name": "The Wolf of Wall Street", "rating": 8.2, "votes": "1.5M", "image": "https://m.media-amazon.com/images/M/MV5BMjIxMjgxNTk0MF5BMl5BanBnXkFtZTgwNjIyOTg2MDE@._V1_.jpg"},
        {"id": "tt0114709", "name": "Toy Story", "rating": 8.3, "votes": "1.0M", "image": "https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_.jpg"},
        {"id": "tt4633694", "name": "Spider-Man: Into the Spider-Verse", "rating": 8.4, "votes": "600K", "image": "https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzOF5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_.jpg"}
    ],
    "Drama": [
        {"id": "tt0068646", "name": "The Godfather", "rating": 9.2, "votes": "2.1M", "image": "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"},
        {"id": "tt0468569", "name": "The Dark Knight", "rating": 9.0, "votes": "2.7M", "image": "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg"},
        {"id": "tt0060196", "name": "The Good, the Bad and the Ugly", "rating": 8.8, "votes": "800K", "image": "https://m.media-amazon.com/images/M/MV5BOTQ5NDI3MTI4MF5BMl5BanBnXkFtZTgwNDQ4ODE5MDE@._V1_.jpg"},
        {"id": "tt0110912", "name": "Pulp Fiction", "rating": 8.9, "votes": "2.2M", "image": "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"},
        {"id": "tt0111161", "name": "The Shawshank Redemption", "rating": 9.3, "votes": "3.0M", "image": "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg"},
        {"id": "tt0050083", "name": "12 Angry Men", "rating": 9.0, "votes": "900K", "image": "https://m.media-amazon.com/images/M/MV5BMWU4N2FjNzYtNTVkNC00NzQ0LTg0MjAtYTJlMjFhNGUxZDFmXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_.jpg"},
        {"id": "tt0167260", "name": "The Lord of the Rings: The Return of the King", "rating": 9.0, "votes": "2.0M", "image": "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"},
        {"id": "tt0109830", "name": "Forrest Gump", "rating": 8.8, "votes": "2.3M", "image": "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg"},
        {"id": "tt0108052", "name": "Schindler's List", "rating": 9.0, "votes": "1.5M", "image": "https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg"}
    ]
};


// Array to store favorite movies
let favoriteMovies = [];

function loadContent() {
    const genre = document.getElementById('genre').value;
    const contentListVotes = document.getElementById('content-list-votes');
    const contentListRating = document.getElementById('content-list-rating');

    if (genre && data[genre]) {
        const movies = data[genre];

        // Clear previous content
        contentListVotes.innerHTML = '';
        contentListRating.innerHTML = '';

        // Sort by votes (descending)
        const sortedByVotes = [...movies].sort((a, b) => {
            const votesA = a.votes ? parseInt(a.votes.replace(/[^\d]/g, '')) : 0;
            const votesB = b.votes ? parseInt(b.votes.replace(/[^\d]/g, '')) : 0;
            return votesB - votesA;
        });

        // Sort by rating (descending)
        const sortedByRating = [...movies].sort((a, b) => {
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            return ratingB - ratingA;
        });

        // Display top 10 movies by votes
        sortedByVotes.slice(0, 10).forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-item');
            movieElement.innerHTML = `
                <img src="${movie.image}" alt="${movie.name}" class="movie-image">
                <h3>${movie.name}</h3>
                <p>Votes: ${movie.votes || 'N/A'}</p>
                <p>Rating: ${movie.rating || 'N/A'}</p>
                <button onclick="addToFavorites('${movie.id}', '${movie.name}')">Add to Favorites</button>
            `;
            contentListVotes.appendChild(movieElement);
        });

        // Display top 10 movies by rating
        sortedByRating.slice(0, 10).forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-item');
            movieElement.innerHTML = `
                <img src="${movie.image}" alt="${movie.name}" class="movie-image">
                <h3>${movie.name}</h3>
                <p>Rating: ${movie.rating || 'N/A'}</p>
                <p>Votes: ${movie.votes || 'N/A'}</p>
                <button onclick="addToFavorites('${movie.id}', '${movie.name}')">Add to Favorites</button>
            `;
            contentListRating.appendChild(movieElement);
        });
    } else {
        contentListVotes.innerHTML = '<p>Please select a genre to see the top content.</p>';
        contentListRating.innerHTML = '';
    }
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
});