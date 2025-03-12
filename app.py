from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache

app = Flask(__name__)

# MySQL Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@127.0.0.1:3306/imdb_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Cache configuration
app.config['CACHE_TYPE'] = 'SimpleCache'
app.config['CACHE_DEFAULT_TIMEOUT'] = 300

cache = Cache(app)

@app.route('/movies')
@cache.cached(timeout=600)
def get_movies():
    result = db.engine.execute("SELECT * FROM movies LIMIT 10")
    movies = [dict(row) for row in result]
    return {"movies": movies}

# Test connection
@app.route('/')
def index():
    return "Flask is connected to MySQL!"

if __name__ == '__main__':
    app.run(debug=True)