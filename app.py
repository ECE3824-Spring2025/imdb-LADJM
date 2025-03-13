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

# Route to fetch movies as JSON
@app.route('/movies')
@cache.cached(timeout=600)
def get_movies():
    try:
        # Get page and per_page parameters from the request (default to page 1 and 30 movies per page)
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 30, type=int)

        # Fetch movies with pagination
        movies = Movie.query.paginate(page=page, per_page=per_page, error_out=False)
        movies_data = [{
            'tconst': movie.tconst,
            'titleType': movie.titleType,
            'primaryTitle': movie.primaryTitle,
            'originalTitle': movie.originalTitle,
            'isAdult': movie.isAdult,
            'startYear': movie.startYear,
            'endYear': movie.endYear,
            'runtimeMinutes': movie.runtimeMinutes,
            'genres': movie.genres
        } for movie in movies.items]

        # Return movies along with pagination metadata
        return jsonify({
            "movies": movies_data,
            "page": movies.page,
            "per_page": movies.per_page,
            "total_pages": movies.pages,
            "total_movies": movies.total
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def index():
    try:
        # Fetch the first page of movies (30 movies per page)
        page = request.args.get('page', 1, type=int)
        per_page = 30
        movies = Movie.query.paginate(page=page, per_page=per_page, error_out=False)
        return render_template('home.html', movies=movies.items, pagination=movies)
    except Exception as e:
        return f"An error occurred: {str(e)}", 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5001)