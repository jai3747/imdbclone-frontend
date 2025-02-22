import React, { useEffect, useState } from "react";
import { MovieCard } from "./MovieCard";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { backend_API } from "./global";
import axios from "axios";

function Movie() {
  const [moviesData, setMoviesData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMovies();
  }, []);

  const getMovies = async () => {
    const movies = await axios.get(`${backend_API}/movies`);
    setMoviesData(movies.data);
  };

  // console.log(moviesData);

  const deleteMovie = async(id) => {
    await axios.delete(`${backend_API}/movies/delete-movie/${id}`)
    getMovies()
  }

  return (
    <div className="movie-list">
      {moviesData.map(
        (
          { _id, name, desc, director, yearOfRelease, poster, producer, actors },
          i
        ) => {
          return (
            <MovieCard
              key={i}
              id={_id}
              name={name}
              desc={desc}
              director={director}
              yearOfRelease={yearOfRelease}
              poster={poster}
              producer={producer}
              actors={actors}
              deleteButton={
                <IconButton
                  onClick={ () => deleteMovie(_id)}
                  color="error"
                  aria-label="delete"
                  size="large"
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              }
              editButton={
                <IconButton
                  onClick={() => {
                    navigate(`/movies/edit/${_id}`);
                  }}
                  color="primary"
                  aria-label="delete"
                  size="large"
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
              }
            />
          );
        }
      )}
    </div>
  );
}

export default Movie;

/* () => {
  const copyAddMovie = [...Addmovies];
  copyAddMovie.splice(i, 1);
  setAddMovie(copyAddMovie);
} */
