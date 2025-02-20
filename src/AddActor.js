// src/components/AddActor.js
import React, { useState } from "react";
import { Button, TextField, FormControl, InputLabel, MenuItem, Select, Box, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { api } from "./config/api.config";

function AddActor() {
  const navigate = useNavigate();
  const [gender, setGender] = useState("");

  const validationSchema = yup.object({
    name: yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
    bio: yup.string().required("Bio is required").min(5, "Bio must be at least 5 characters"),
    image: yup.string().required("Image URL is required").min(5, "Image URL must be at least 5 characters"),
    DOB: yup.date().required("Date of Birth is required").nullable(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      bio: "",
      image: "",
      DOB: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const date = values.DOB.toISOString().slice(0, 10);
        await api.actors.add({ ...values, gender, DOB: date });
        navigate("/add-movies");
      } catch (error) {
        console.error("Error adding actor:", error);
        // Handle error appropriately
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add New Actor
        </Typography>

        <TextField
          fullWidth
          id="name"
          name="name"
          label="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          margin="normal"
        />

        <TextField
          fullWidth
          id="bio"
          name="bio"
          label="Bio"
          multiline
          rows={4}
          value={formik.values.bio}
          onChange={formik.handleChange}
          error={formik.touched.bio && Boolean(formik.errors.bio)}
          helperText={formik.touched.bio && formik.errors.bio}
          margin="normal"
        />

        <TextField
          fullWidth
          id="image"
          name="image"
          label="Image URL"
          value={formik.values.image}
          onChange={formik.handleChange}
          error={formik.touched.image && Boolean(formik.errors.image)}
          helperText={formik.touched.image && formik.errors.image}
          margin="normal"
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date of Birth"
            value={formik.values.DOB}
            onChange={(newValue) => formik.setFieldValue("DOB", newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                error={formik.touched.DOB && Boolean(formik.errors.DOB)}
                helperText={formik.touched.DOB && formik.errors.DOB}
              />
            )}
          />
        </LocalizationProvider>

        <FormControl fullWidth margin="normal">
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            id="gender"
            value={gender}
            label="Gender"
            onChange={(e) => setGender(e.target.value)}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 3, mb: 2 }}
        >
          Add Actor
        </Button>
      </Box>
    </Container>
  );
}

export default AddActor;