import unittest
from unittest.mock import patch, MagicMock
from app import app, db, Movie, Rating

class TestMoviesRoute(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch('app.db.session.query')
    def test_get_movies(self, mock_query):
        # Create fake movie data
        fake_movie1 = Movie(
            tconst='tt0000001',
            primaryTitle='Movie 1',
            startYear=2000,
            genres='Comedy'
        )
        fake_rating1 = Rating(
            tconst='tt0000001',
            averageRating=7.8,
            numVotes=1200
        )

        fake_movie2 = Movie(
            tconst='tt0000002',
            primaryTitle='Movie 2',
            startYear=2001,
            genres='Action'
        )
        fake_rating2 = Rating(
            tconst='tt0000002',
            averageRating=6.5,
            numVotes=800
        )

        # Mock the pagination object
        fake_pagination = MagicMock()
        fake_pagination.items = [(fake_movie1, fake_rating1), (fake_movie2, fake_rating2)]
        fake_pagination.page = 1
        fake_pagination.per_page = 2
        fake_pagination.pages = 10
        fake_pagination.total = 300

        # Configure the mock query return
        mock_query.return_value.join.return_value.order_by.return_value.paginate.return_value = fake_pagination

        # Make a GET request to the route
        response = self.app.get('/movies?page=1&per_page=2')

        # Validate response
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertEqual(data["total_movies"], 300)
        self.assertEqual(len(data["movies"]), 2)
        self.assertEqual(data["movies"][0]["primaryTitle"], "Movie 1")
        self.assertEqual(data["movies"][1]["primaryTitle"], "Movie 2")

    def tearDown(self):
        pass

if __name__ == '__main__':
    unittest.main()