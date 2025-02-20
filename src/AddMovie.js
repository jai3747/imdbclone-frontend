import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    .min(3, "Movie name must be at least 3 characters")
    .max(100, "Movie name must not exceed 100 characters")
    .trim(),
  desc: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters")
    .trim(),
  director: yup
    .string()
    .required("Director name is required")
    .min(3, "Director name must be at least 3 characters")
    .max(100, "Director name must not exceed 100 characters")
    .trim(),
  poster: yup
    .string()
    .required("Poster URL is required")
    .url("Must be a valid URL")
    .trim(),
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
    .max(20, "Cannot select more than 20 actors")
    .required("Actor selection is required")
});

const AddMovie = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [producers, setProducers] = useState([]);
  const [actors, setActors] = useState([]);

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
        await api.movies.add(values);
        navigate("/");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to add movie. Please try again.");
        console.error("Add movie error:", err);
      } finally {
        setLoading(false);
      }
    }
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);
      const [producersRes, actorsRes] = await Promise.all([
        api.producers.getAll(),
        api.actors.getAll()
      ]);
      setProducers(producersRes.data);
      setActors(actorsRes.data);
    } catch (err) {
      setError("Failed to load producers and actors. Please try again later.");
      console.error("Load initial data error:", err);
    } finally {
      setInitialLoading(false);
    }
  };

  if (initialLoading) {
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
          Add New Movie
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

          <TextField
            fullWidth
            label="Poster URL"
            {...formik.getFieldProps('poster')}
            error={formik.touched.poster && Boolean(formik.errors.poster)}
            helperText={formik.touched.poster && formik.errors.poster}
          />

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
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={actors.find(actor => actor._id === value)?.name}
                      size="small"
                    />
                  ))}
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

          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            size="large"
            sx={{ mt: 2 }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Add Movie'
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddMovie;