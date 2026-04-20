import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const env = process.env;

function Movies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // 🔹 Fetch all movies
  const fetchAllMovies = () => {
    fetch(`${env.REACT_APP_API_URL}/movies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        return response.json();
      })
      .then((data) => {
        setMovies(data);
        setError('');
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    fetchAllMovies();
  }, [navigate]);

  // 🔹 Handle search
  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      fetchAllMovies();
      return;
    }

    fetch(`${env.REACT_APP_API_URL}/movies/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`
      },
      body: JSON.stringify({ search })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Search failed');
        }
        return response.json();
      })
      .then((data) => {
        setMovies(data);
        setError('');
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  // Reset search
  const handleReset = () => {
    setSearch('');
    fetchAllMovies();
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Top Rated Movies</h2>

      {/* SEARCH BAR */}
      <Form onSubmit={handleSearch} className="mb-4">
        <Row>
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Search by movie title or actor name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Button type="submit" className="w-100">
              Search
            </Button>
          </Col>
          <Col md={2}>
            <Button variant="secondary" className="w-100" onClick={handleReset}>
              Reset
            </Button>
          </Col>
        </Row>
      </Form>

      {/* ERROR */}
      {error && <p className="text-danger text-center">{error}</p>}

      {/* MOVIE GRID */}
      <Row>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <Col md={4} className="mb-4" key={movie._id}>
              <Card className="h-100">
                {movie.imageUrl && (
                  <Card.Img
                    variant="top"
                    src={movie.imageUrl}
                    alt={movie.title}
                    style={{ height: '400px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>

                  <Card.Text>
                    <strong>Genre:</strong> {movie.genre}
                  </Card.Text>

                  <Card.Text>
                    <strong>Average Rating:</strong>{' '}
                    {movie.avgRating
                      ? movie.avgRating.toFixed(1)
                      : 'No ratings yet'}
                  </Card.Text>

                  <Button
                    onClick={() => navigate(`/movies/${movie._id}`)}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">No movies found.</p>
        )}
      </Row>
    </Container>
  );
}

export default Movies;