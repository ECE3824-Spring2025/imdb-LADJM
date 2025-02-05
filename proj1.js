// script.js

const data = {
    "Action": [
        { "title": "Mad Max: Fury Road", "score": 8.1, "votes": 100000, "genre": "Action" },
        { "title": "The Dark Knight", "score": 9.0, "votes": 200000, "genre": "Action" },
        // Add more Action movies here
    ],
    "Comedy": [
        { "title": "The Hangover", "score": 7.7, "votes": 300000, "genre": "Comedy" },
        { "title": "Superbad", "score": 8.0, "votes": 150000, "genre": "Comedy" },
        // Add more Comedy movies here
    ],
    "Drama": [
        { "title": "The Shawshank Redemption", "score": 9.3, "votes": 250000, "genre": "Drama" },
        { "title": "Forrest Gump", "score": 8.8, "votes": 180000, "genre": "Drama" },
        // Add more Drama movies here
    ],
    "Horror": [
        { "title": "Get Out", "score": 8.0, "votes": 120000, "genre": "Horror" },
        { "title": "The Conjuring", "score": 7.5, "votes": 90000, "genre": "Horror" },
        // Add more Horror movies here
    ],
    "Thriller": [
        { "title": "Inception", "score": 8.8, "votes": 220000, "genre": "Thriller" },
        { "title": "The Prestige", "score": 8.5, "votes": 160000, "genre": "Thriller" },
        // Add more Thriller movies here
    ]
};

function loadContent() {
    const genre = document.getElementById('genre').value;
    const contentList = document.getElementById('content-list');

    if (genre && data[genre]) {
        contentList.innerHTML = ''; // Clear previous content
        const movies = data[genre];

        // Sort movies by score (descending) or votes (descending)
        movies.sort((a, b) => b.score - a.score);  // Sorting by score as an example

        // Display top 10 movies
        movies.slice(0, 10).forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-item');
            movieElement.innerHTML = `
                <h3>${movie.title}</h3>
                <p>IMDb Score: ${movie.score}</p>
                <p>Votes: ${movie.votes}</p>
            `;
            contentList.appendChild(movieElement);
        });
    } else {
        contentList.innerHTML = '<p>Please select a genre to see the top 10 content.</p>';
    }
}