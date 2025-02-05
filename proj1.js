// script.js

const data = {
    "Action": [
        // Add more Action movies here
    ],
    "Comedy": [
        // Add more Comedy movies here
    ],
    "Drama": [
        // Add more Drama movies here
    ],
    "Horror": [
        // Add more Horror movies here
    ],
    "Thriller": [
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