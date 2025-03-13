from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache
import logging

# Initialize Flask app
app = Flask(__name__)

# MySQL Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:my-secret-pw@127.0.0.1/imdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Cache configuration
app.config['CACHE_TYPE'] = 'SimpleCache'
app.config['CACHE_DEFAULT_TIMEOUT'] = 300
cache = Cache(app)

# Enable SQLAlchemy logging for debugging
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

# Define a model for the movies table
class Movie(db.Model):
    __tablename__ = 'movies'
    
    tconst = db.Column(db.String(20), primary_key=True)
    titleType = db.Column(db.String(50), nullable=True)
    primaryTitle = db.Column(db.String(255), nullable=True)
    originalTitle = db.Column(db.String(255), nullable=True)
    isAdult = db.Column(db.Boolean, nullable=True)
    startYear = db.Column(db.Integer, nullable=True)
    endYear = db.Column(db.Integer, nullable=True)
    runtimeMinutes = db.Column(db.Integer, nullable=True)
    genres = db.Column(db.String(255), nullable=True)

# Define a model for the ratings table
class Rating(db.Model):
    __tablename__ = 'ratings'
    
    tconst = db.Column(db.String(20), db.ForeignKey('movies.tconst'), primary_key=True)
    averageRating = db.Column(db.Float, nullable=True)
    numVotes = db.Column(db.Integer, nullable=True)


# Route to fetch movies with ratings (paginated)
@app.route('/movies')
@cache.cached(timeout=600)  # Cache for 10 minutes
def get_movies():
    try:
        # Get page and per_page parameters from the request (default to page 1 and 30 movies per page)
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 30, type=int)

        # Join movies and ratings tables with pagination
        movies_with_ratings = db.session.query(Movie, Rating).join(Rating, Movie.tconst == Rating.tconst) \
            .order_by(Rating.averageRating.desc()) \
            .paginate(page=page, per_page=per_page, error_out=False)

        # Prepare the data for JSON response
        movies_data = [{
            'tconst': movie.tconst,
            'titleType': movie.titleType,
            'primaryTitle': movie.primaryTitle,
            'originalTitle': movie.originalTitle,
            'isAdult': movie.isAdult,
            'startYear': movie.startYear,
            'endYear': movie.endYear,
            'runtimeMinutes': movie.runtimeMinutes,
            'genres': movie.genres,
            'averageRating': rating.averageRating,
            'numVotes': rating.numVotes
        } for movie, rating in movies_with_ratings.items]

        # Return movies along with pagination metadata
        return jsonify({
            "movies": movies_data,
            "page": movies_with_ratings.page,
            "per_page": movies_with_ratings.per_page,
            "total_pages": movies_with_ratings.pages,
            "total_movies": movies_with_ratings.total
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to render the home page (paginated)
@app.route('/')
def index():
    try:
        # Get page and per_page parameters from the request (default to page 1 and 30 movies per page)
        page = request.args.get('page', 1, type=int)
        per_page = 30

        # Join movies and ratings tables with pagination
        movies_with_ratings = db.session.query(Movie, Rating).join(Rating, Movie.tconst == Rating.tconst) \
            .order_by(Rating.averageRating.desc()) \
            .paginate(page=page, per_page=per_page, error_out=False)

        # Pass the paginated data to the template
        return render_template('home.html', movies=movies_with_ratings.items, pagination=movies_with_ratings)
    except Exception as e:
        return f"An error occurred: {str(e)}", 500
    
@app.route('/search')
def search_movies():
    try:
        search_term = request.args.get('q', '').lower()

        # Filter movies based on the search term
        filtered_movies = []
        for tconst, movie in movies_dict.items():
            rating = ratings_dict.get(tconst)
            if (search_term in movie.primaryTitle.lower()) or (search_term in movie.genres.lower()):
                filtered_movies.append({
                    'tconst': movie.tconst,
                    'primaryTitle': movie.primaryTitle,
                    'startYear': movie.startYear,
                    'genres': movie.genres,
                    'runtimeMinutes': movie.runtimeMinutes,
                    'averageRating': rating.averageRating if rating else 'N/A',
                    'numVotes': rating.numVotes if rating else 'N/A'
                })

        return jsonify({"movies": filtered_movies})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5001)
