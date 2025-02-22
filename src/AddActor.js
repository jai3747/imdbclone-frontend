import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { API, backend_API } from "./global";
import { useFormik } from "formik";
import * as yup from "yup";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker , LocalizationProvider } from "@mui/x-date-pickers";
import axios from "axios";

function AddActor() {
  const navigate = useNavigate();
  const [gender, setGender] = useState("");

  const handleGenderChange = (e) => {
    const { value } = e.target;
    setGender(value);
  };

  const movieValidationSchema = yup.object({
    name: yup.string().required("*Name field is mandatory").min(3),
    bio: yup.string().required("*Bio field is mandatory").min(5),
    image: yup.string().required("*Image field is mandatory").min(5),
    DOB: yup.date().required("*DOB  is mandatory"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      bio: "",
      image: "",
      DOB: null,
    },
    validationSchema: movieValidationSchema,
    onSubmit: async(newActor) => {
      const date = formik.values.DOB.toISOString().slice(0,10) 
      // console.log("onSubmit : ", { ...newActor, gender,DOB: date });
      const res = await axios.post(`${backend_API}/actors/add-actor`,{ ...newActor, gender,DOB: date });
      navigate("/add-movies")
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="formGroup">
        <TextField
          label="Enter the Actor name"
          variant="outlined"
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name}
          helperText={
            formik.touched.name && formik.errors.name ? formik.errors.name : ""
          }
        />
        <TextField
          label="Enter the bio"
          variant="outlined"
          id="bio"
          name="bio"
          value={formik.values.bio}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.bio && formik.errors.bio}
          helperText={
            formik.touched.bio && formik.errors.bio ? formik.errors.bio : ""
          }
        />
        <TextField
          label="Enter the image link"
          variant="outlined"
          id="image"
          name="image"
          value={formik.values.image}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.image && formik.errors.image}
          helperText={
            formik.touched.image && formik.errorimage ? formik.errors.image : ""
          }
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FormControl fullWidth>
            <DatePicker 
              id="DOB"
              name="DOB"
              value={formik.values.DOB}
              onChange={(newValue) => formik.setFieldValue("DOB", newValue)}
            //   label="Date of Birth"
              error={formik.touched.DOB && Boolean(formik.errors.DOB)}
              helperText={formik.touched.DOB && formik.errors.DOB}
            />
          </FormControl>
        </LocalizationProvider>
        <FormControl fullWidth>
          <InputLabel id="gender">Gender</InputLabel>
          <Select
            labelId="gender"
            id="gender"
            value={gender}
            label="gender"
            onChange={handleGenderChange}
          >
            <MenuItem value={"male"}>Male</MenuItem>
            <MenuItem value={"female"}>Female</MenuItem>
            <MenuItem value={"others"}>Others</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" type="submit">
          Add Actor
        </Button>
      </form>
    </>
  );
}

export default AddActor;
