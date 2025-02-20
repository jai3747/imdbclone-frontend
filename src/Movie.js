// src/Movies.js
import React, { useEffect, useState, useCallback } from "react";
import { MovieCard } from "./MovieCard";
import { api } from "./config/api.config";
import { 
  CircularProgress, 
  Alert, 
  Container, 
  Grid, 
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

const Movies = () => {
  const [moviesData, setMoviesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.movies.getAll();
      setMoviesData(response.data);
    } catch (error) {
      setError('Failed to fetch movies. Please try again later.');
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getMovies();
  }, [getMovies]);

  const deleteMovie = async (id) => {
    try {
      setError(null);
      await api.movies.delete(id);
      await getMovies();
    } catch (error) {
      setError('Failed to delete movie. Please try again.');
      console.error("Error deleting movie:", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 64px)">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box 
        display="flex" 
        flexDirection={isMobile ? 'column' : 'row'} 
        justifyContent="space-between" 
        alignItems={isMobile ? 'stretch' : 'center'} 
        mb={4}
        gap={2}
      >
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontWeight: 600,
            color: theme.palette.mode === 'dark' ? 'primary.light' : 'primary.dark'
          }}
        >
          Movies Collection
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/add-movies")}
          fullWidth={isMobile}
          sx={{ 
            minWidth: isMobile ? '100%' : 'auto',
            height: 48
          }}
        >
          Add New Movie
        </Button>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {moviesData.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">
              No movies available. Add your first movie to get started!
            </Alert>
          </Grid>
        ) : (
          moviesData.map((movie) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              key={movie._id}
              sx={{
                display: 'flex',
                alignItems: 'stretch'
              }}
            >
              <MovieCard
                {...movie}
                onDelete={() => deleteMovie(movie._id)}
                onEdit={() => navigate(`/movies/edit/${movie._id}`)}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default Movies;