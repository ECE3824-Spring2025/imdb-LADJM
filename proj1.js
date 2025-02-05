const data = {
    "Action": [
        {"id": "tt0468569", "name": "The Dark Knight", "rating": 9.0}, 
        {"id": "tt1375666", "name": "Inception", "rating": 8.8},
        {"id": "tt0080684", "name": "Star Wars: Episode V - The Empire Strikes Back", "rating": 8.7},
        {"id": "tt0133093", "name": "The Matrix", "rating": 8.7},
        {"id": "tt8579674", "name": "1917", "rating": 8.2},
        {"id": "tt0364569", "name": "Oldboy", "rating": 8.3}, 
        {"id": "tt0082971", "name": "Raiders of the Lost Ark", "rating": 8.4},
        {"id": "tt0172495", "name": "Gladiator", "rating": 8.5},
        {"id": "tt0103064", "name": "Terminator 2: Judgment Day", "rating": 8.6},
        {"id": "tt0047478", "name": "Seven Samurai", "rating": 8.6},
        {"id": "tt9218128", "name": "Gladiator II", "votes": "172K"}, 
        {"id": "tt0087182", "name": "Dune", "votes": "203K"},
        {"id": "tt1684562", "name": "The Fall Guy", "votes": "203K"},
        {"id": "tt6263850", "name": "Deadpool & Wolverine", "votes": "454K"}, 
        {"id": "tt17279496", "name": "Civil War", "votes": "219K"}, 
        {"id": "tt1160419", "name": "Dune: Part One", "votes": "933K"}, 
        {"id": "tt11138512", "name": "The Northman", "votes": "271K"}, 
        {"id": "tt15239678", "name": "Dune: Part Two", "votes": "585K"}, 
        {"id": "tt12037194", "name": "Furiosa: A Mad Max Saga", "votes": "261K"}
    ]
};

function parseVotes(votes) {
    if (!votes) return 0;
    return parseFloat(votes.replace('K', '000').replace('M', '000000'));
}

function loadContent() {
    const genre = document.getElementById('genre').value;
    const contentList = document.getElementById('content-list');

    if (genre && data[genre]) {
        contentList.innerHTML = ''; // Clear previous content
        let movies = data[genre];

        // Sort movies by rating (if exists), otherwise by votes
        movies.sort((a, b) => (b.rating || parseVotes(b.votes)) - (a.rating || parseVotes(a.votes)));

        // Display top 10 movies
        movies.slice(0, 10).forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-item');
            movieElement.innerHTML = `
                <h3>${movie.name}</h3>
                <p>IMDb Score: ${movie.rating ? movie.rating : 'N/A'}</p>
                <p>Votes: ${movie.votes ? movie.votes : 'N/A'}</p>
            `;
            contentList.appendChild(movieElement);
        });
    } else {
        contentList.innerHTML = '<p>Please select a genre to see the top 10 content.</p>';
    }
}
