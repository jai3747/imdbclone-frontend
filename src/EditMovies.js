import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "./config/api.config";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Alert,
  Container,
  Box,
  Typography,
  Chip,
  OutlinedInput,
  FormHelperText,
  Paper
} from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const movieValidationSchema = yup.object({
  name: yup
    .string()
    .required("Movie name is required")
    .min(3, "Movie name must be at least 3 characters"),
  desc: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  director: yup
    .string()
    .required("Director name is required")
    .min(3, "Director name must be at least 3 characters"),
  poster: yup
    .string()
    .required("Poster URL is required")
    .url("Must be a valid URL"),
  yearOfRelease: yup
    .number()
    .required("Release year is required")
    .min(1888, "Year must be 1888 or later")
    .max(new Date().getFullYear() + 5, "Year cannot be more than 5 years in the future"),
  producer: yup
    .string()
    .required("Producer selection is required"),
  actors: yup
    .array()
    .min(1, "Please select at least one actor")
    .required("Actor selection is required")
});

const EditMovies = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [producers, setProducers] = useState([]);
  const [actors, setActors] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      desc: "",
      director: "",
      poster: "",
      yearOfRelease: new Date().getFullYear(),
      producer: "",
      actors: []
    },
    validationSchema: movieValidationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        await api.movies.update(id, values);
        navigate("/");
      } catch (err) {
        setError("Failed to update movie. Please try again.");
        console.error("Update movie error:", err);
      } finally {
        setLoading(false);
      }
    }
  });

  // Memoized loadData function with all required dependencies
  const loadData = useCallback(async () => {
    if (!id) return; // Guard clause for when id is not available

    try {
      setLoading(true);
      setError(null);
      
      const [movieRes, producersRes, actorsRes] = await Promise.all([
        api.movies.getById(id),
        api.producers.getAll(),
        api.actors.getAll()
      ]);

      setProducers(producersRes.data);
      setActors(actorsRes.data);

      // Use the entire formik object since we depend on it
      formik.setValues({
        name: movieRes.data.name,
        desc: movieRes.data.desc,
        director: movieRes.data.director,
        poster: movieRes.data.poster,
        yearOfRelease: movieRes.data.yearOfRelease,
        producer: movieRes.data.producer._id,
        actors: movieRes.data.actors.map(actor => actor._id)
      });
    } catch (err) {
      setError("Failed to load movie data. Please try again later.");
      console.error("Load data error:", err);
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [id, navigate, formik]); // Include the entire formik object in dependencies

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (formik.values.poster && formik.values.poster.match(/^https?:\/\/.+/)) {
      const img = new Image();
      img.src = formik.values.poster;
      img.onload = () => setPreviewUrl(formik.values.poster);
      img.onerror = () => setPreviewUrl("");
    } else {
      setPreviewUrl("");
    }
  }, [formik.values.poster]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Movie
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'grid', gap: 2 }}>
          <TextField
            fullWidth
            label="Movie Name"
            {...formik.getFieldProps('name')}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            {...formik.getFieldProps('desc')}
            error={formik.touched.desc && Boolean(formik.errors.desc)}
            helperText={formik.touched.desc && formik.errors.desc}
          />

          <TextField
            fullWidth
            label="Director"
            {...formik.getFieldProps('director')}
            error={formik.touched.director && Boolean(formik.errors.director)}
            helperText={formik.touched.director && formik.errors.director}
          />

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Poster URL"
                {...formik.getFieldProps('poster')}
                error={formik.touched.poster && Boolean(formik.errors.poster)}
                helperText={formik.touched.poster && formik.errors.poster}
              />
            </Box>
            {previewUrl && (
              <Paper elevation={3} sx={{ p: 1 }}>
                <img
                  src={previewUrl}
                  alt="Poster preview"
                  style={{ height: 100, objectFit: 'contain' }}
                  onError={() => setPreviewUrl("")}
                />
              </Paper>
            )}
          </Box>

          <TextField
            fullWidth
            type="number"
            label="Year of Release"
            {...formik.getFieldProps('yearOfRelease')}
            error={formik.touched.yearOfRelease && Boolean(formik.errors.yearOfRelease)}
            helperText={formik.touched.yearOfRelease && formik.errors.yearOfRelease}
          />

          <FormControl 
            fullWidth
            error={formik.touched.producer && Boolean(formik.errors.producer)}
          >
            <InputLabel>Producer</InputLabel>
            <Select
              {...formik.getFieldProps('producer')}
              label="Producer"
            >
              {producers.map(producer => (
                <MenuItem key={producer._id} value={producer._id}>
                  {producer.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.producer && formik.errors.producer && (
              <FormHelperText>{formik.errors.producer}</FormHelperText>
            )}
          </FormControl>

          <FormControl 
            fullWidth
            error={formik.touched.actors && Boolean(formik.errors.actors)}
          >
            <InputLabel>Actors</InputLabel>
            <Select
              multiple
              {...formik.getFieldProps('actors')}
              input={<OutlinedInput label="Actors" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const actor = actors.find(a => a._id === value);
                    return (
                      <Chip
                        key={value}
                        label={actor ? actor.name : 'Unknown'}
                        size="small"
                      />
                    );
                  })}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {actors.map(actor => (
                <MenuItem key={actor._id} value={actor._id}>
                  {actor.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.actors && formik.errors.actors && (
              <FormHelperText>{formik.errors.actors}</FormHelperText>
            )}
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              size="large"
              fullWidth
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Update Movie'
              )}
            </Button>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default EditMovies;