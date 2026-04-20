import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const env = process.env;

function Movies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

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
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [navigate]);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Top Rated Movies</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      <Row>
        {movies.map((movie) => (
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
                  {movie.avgRating ? movie.avgRating.toFixed(1) : 'No ratings yet'}
                </Card.Text>
                <Button onClick={() => navigate(`/movies/${movie._id}`)}>
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Movies;