// script.js

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
        {"id": "tt0047478", "name": "Seven Samurai", "rating": 8.6}, // Added comma here
        {"id": "tt9218128", "name": "Gladiator II", "votes": "172K"}, 
        {"id": "tt0087182", "name": "Dune", "votes": "203K"},
        {"id": "tt1684562", "name": "The Fall Guy", "votes": "203K"},
        {"id": "tt6263850", "name": "Deadpool & Wolverine", "votes": "454K"}, 
        {"id": "tt17279496", "name": "Civil War", "votes": "219K"}, 
        {"id": "tt0172495", "name": "Gladiator", "votes": "1.7M"}, 
        {"id": "tt1160419", "name": "Dune: Part One", "votes": "933K"}, 
        {"id": "tt11138512", "name": "The Northman", "votes": "271K"}, 
        {"id": "tt15239678", "name": "Dune: Part Two", "votes": "585K"}, 
        {"id": "tt12037194", "name": "Furiosa: A Mad Max Saga", "votes": "261K"}
    ],
    "Comedy": [
        {"id": "tt0118799", "name": "Life Is Beautiful", "rating": 8.6}, 
        {"id": "tt0088763", "name": "Back to the Future", "rating": 8.5},
        {"id": "tt6966692", "name": "Green Book", "rating": 8.2},
        {"id": "tt0120735", "name": "Lock, Stock and Two Smoking Barrels", "rating": 8.1},
        {"id": "tt2096673", "name": "Inside Out", "rating": 8.1},
        {"id": "tt5027774", "name": "Three Billboards Outside Ebbing, Missouri", "rating": 8.1}, 
        {"id": "tt0208092", "name": "Snatch", "rating": 8.2},
        {"id": "tt0993846", "name": "The Wolf of Wall Street", "rating": 8.2},
        {"id": "tt0114709", "name": "Toy Story", "rating": 8.3},
        {"id": "tt4633694", "name": "Spider-Man: Into the Spider-Verse", "rating": 8.4}, // Added comma here
        {"id": "tt7131622", "name": "Once Upon a Time... in Hollywood", "votes": "887K"},
        {"id": "tt16426418", "name": "Challengers", "votes": "137K"},
        {"id": "tt1684562", "name": "The Fall Guy", "votes": "203K"},
        {"id": "tt6263850", "name": "Deadpool & Wolverine", "votes": "454K"}, 
        {"id": "tt14948432", "name": "Red One", "votes": "129K"}, 
        {"id": "tt28607951", "name": "Anora", "votes": "68K"}, 
        {"id": "tt13622970", "name": "Moana 2", "votes": "66K"}, 
        {"id": "tt18259086", "name": "Sonic the Hedgehog 3", "votes": "28K"}, 
        {"id": "tt21823606", "name": "A Real Pain", "votes": "29K"}, 
        {"id": "tt20221436", "name": "Emilia Pérez", "votes": "32K"}
    ],
    "Drama": [
        {"id": "tt0068646", "name": "The Godfather", "rating": 9.2}, 
        {"id": "tt0468569", "name": "The Dark Knight", "rating": 9.0},
        {"id": "tt0060196", "name": "The Good, the Bad and the Ugly", "rating": 8.8},
        {"id": "tt0110912", "name": "Pulp Fiction", "rating": 8.9},
        {"id": "tt0068646", "name": "The Godfather", "rating": 9.2},
        {"id": "tt0111161", "name": "The Shawshank Redemption", "rating": 9.3}, 
        {"id": "tt0050083", "name": "12 Angry Men", "rating": 9.0},
        {"id": "tt0167260", "name": "The Lord of the Rings: The Return of the King", "rating": 9.0},
        {"id": "tt0109830", "name": "Forrest Gump", "rating": 8.8},
        {"id": "tt0108052", "name": "Schindler's List", "rating": 9.0}, // Added comma here
        {"id": "tt0816692", "name": "Interstellar", "votes": "2.3M"}, 
        {"id": "tt0111161", "name": "The Shawshank Redemption", "votes": "3M"},
        {"id": "tt0068646", "name": "The Godfather", "votes": "2.1M"},
        {"id": "tt0114369", "name": "Se7en", "votes": "1.9M"}, 
        {"id": "tt7131622", "name": "Once Upon a Time... in Hollywood", "votes": "887K"}, 
        {"id": "tt0172495", "name": "Gladiator", "votes": "1.7M"}, 
        {"id": "tt1160419", "name": "Dune: Part One", "votes": "933K"}, 
        {"id": "tt15398776", "name": "Oppenheimer", "votes": "843K"}, 
        {"id": "tt15239678", "name": "Dune: Part Two", "votes": "585K"}, 
        {"id": "tt0166924", "name": "Mulholland Drive", "votes": "397K"}
    ]
};

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
                <h3>${movie.name}</h3>
                <p>Votes: ${movie.votes || 'N/A'}</p>
                <p>Rating: ${movie.rating || 'N/A'}</p>
            `;
            contentListVotes.appendChild(movieElement);
        });

        // Display top 10 movies by rating
        sortedByRating.slice(0, 10).forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-item');
            movieElement.innerHTML = `
                <h3>${movie.name}</h3>
                <p>Rating: ${movie.rating || 'N/A'}</p>
                <p>Votes: ${movie.votes || 'N/A'}</p>
            `;
            contentListRating.appendChild(movieElement);
        });
    } else {
        contentListVotes.innerHTML = '<p>Please select a genre to see the top content.</p>';
        contentListRating.innerHTML = '';
    }
}