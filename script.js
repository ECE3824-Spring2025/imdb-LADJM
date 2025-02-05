const movieData = {
    drama: {
        ratings: [
            {"id": "tt0068646", "name": "The Godfather", "rating":9.2},
            {"id": "tt0468569", "name": "The Dark Knight", "rating":9.0},
            {"id": "tt0111161", "name": "The Shawshank Redemption", "rating":9.3}
        ],
        likes: [
            {"id": "tt0111161", "name": "The Shawshank Redemption", "votes": "3M"},
            {"id": "tt0068646", "name": "The Godfather", "votes": "2.1M"}
        ]
    },
    action: {
        ratings: [
            {"id": "tt0468569", "name": "The Dark Knight", "rating":9.0},
            {"id": "tt1375666", "name": "Inception", "rating":8.8}
        ],
        likes: [
            {"id": "tt0172495", "name": "Gladiator", "votes": "1.7M"},
            {"id": "tt1160419", "name": "Dune: Part One", "votes": "933K"}
        ]
    },
    comedy: {
        ratings: [
            {"id": "tt0118799", "name": "Life Is Beautiful", "rating":8.6},
            {"id": "tt0088763", "name": "Back to the Future", "rating":8.5}
        ],
        likes: [
            {"id": "tt7131622", "name": "Once Upon a Time... in Hollywood", "votes": "887K"},
            {"id": "tt16426418", "name": "Challengers", "votes": "137K"}
        ]
    }
};

function loadMovies() {
    let genre = document.getElementById("genre").value;
    let ratings = movieData[genre].ratings;
    let likes = movieData[genre].likes;
    
    let tableBody = document.getElementById("movie-list");
    tableBody.innerHTML = "";  

    ratings.forEach(movie => {
        let votes = likes.find(like => like.id === movie.id)?.votes || "N/A";

        let row = `<tr>
            <td>${movie.name}</td>
            <td>${movie.rating}</td>
            <td>${votes}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}