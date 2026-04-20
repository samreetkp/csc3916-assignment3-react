import React, { useEffect, useState } from 'react';
import { Card, ListGroup, ListGroupItem, Image, Form, Button, Row, Col, Container } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';

const env = process.env;

const MovieDetail = () => {
  const { id, movieId } = useParams();
  const navigate = useNavigate();
  const currentMovieId = id || movieId;

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchMovie = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/');
        return;
      }

      setLoading(true);
      setError('');

      const response = await fetch(`${env.REACT_APP_API_URL}/movies/${currentMovieId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }

      const data = await response.json();
      setSelectedMovie(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [currentMovieId]);

  const submitReview = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/');
        return;
      }

      setError('');
      setSuccessMessage('');

      const response = await fetch(`${env.REACT_APP_API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${token}`
        },
        body: JSON.stringify({
          movieId: currentMovieId,
          rating: Number(rating),
          review: review
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      setSuccessMessage(data.message || 'Review created!');
      setRating('');
      setReview('');
      fetchMovie();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (error && !selectedMovie) {
    return <div className="text-center text-danger mt-4">Error: {error}</div>;
  }

  if (!selectedMovie) {
    return <div className="text-center mt-4">No movie data available.</div>;
  }

  return (
    <Container className="mt-4">
      <Button className="mb-3" onClick={() => navigate('/movies')}>
        Back to Movies
      </Button>

      {error && <div className="text-danger mb-3">{error}</div>}
      {successMessage && <div className="text-success mb-3">{successMessage}</div>}

      <Card className="p-3 mb-4">
        <Row>
          <Col md={4}>
            {selectedMovie.imageUrl && (
              <Image
                className="image"
                src={selectedMovie.imageUrl}
                thumbnail
                fluid
              />
            )}
          </Col>

          <Col md={8}>
            <Card.Header className="mb-3">Movie Detail</Card.Header>

            <ListGroup>
              <ListGroupItem>
                <strong>Title:</strong> {selectedMovie.title}
              </ListGroupItem>

              <ListGroupItem>
                <strong>Genre:</strong> {selectedMovie.genre}
              </ListGroupItem>

              <ListGroupItem>
                <strong>Release Date:</strong> {selectedMovie.releaseDate}
              </ListGroupItem>

              <ListGroupItem>
                <strong>Actors:</strong>
                {selectedMovie.actors && selectedMovie.actors.length > 0 ? (
                  selectedMovie.actors.map((actor, i) => (
                    <p key={i} className="mb-1 mt-2">
                      <b>{actor.actorName}</b> as {actor.characterName}
                    </p>
                  ))
                ) : (
                  <p className="mb-0 mt-2">No actors listed.</p>
                )}
              </ListGroupItem>

              <ListGroupItem>
                <h4 className="mb-0">
                  <BsStarFill />{' '}
                  {selectedMovie.avgRating ? selectedMovie.avgRating.toFixed(1) : 'No ratings yet'}
                </h4>
              </ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
      </Card>

      <Card className="p-3 mb-4">
        <Card.Header className="mb-3">Reviews</Card.Header>
        <Card.Body className="bg-white">
          {selectedMovie.movieReviews && selectedMovie.movieReviews.length > 0 ? (
            selectedMovie.movieReviews.map((item, i) => (
              <Card key={i} className="mb-3">
                <Card.Body>
                  <p className="mb-1">
                    <b>{item.username}</b>
                  </p>
                  <p className="mb-1">
                    {item.review}
                  </p>
                  <p className="mb-0">
                    <BsStarFill /> {item.rating}
                  </p>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </Card.Body>
      </Card>

      <Card className="p-3">
        <Card.Header className="mb-3">Add a Review</Card.Header>
        <Card.Body>
          <Form onSubmit={submitReview}>
            <Form.Group className="mb-3">
              <Form.Label>Rating (0 to 5)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="5"
                step="1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit">Submit Review</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MovieDetail;
