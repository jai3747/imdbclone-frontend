import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { API, backend_API } from "./global";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";


function AddMovie() {
  const navigate = useNavigate();
  const [actors, setactors] = useState([]);
  const [producer, setProducer] = useState('');
  const [producerArr,setProducerArr] = useState([]);
  const [actorNames,setActorNames] = useState([]);


  useEffect(()=>{
    getData();
  },[])

  const getData = async() => {
    const res = await axios.get(`${backend_API}/producers`);
    const actorData = await axios.get(`${backend_API}/actors`);
    setProducerArr(res.data);
    setActorNames(actorData.data);
  }

  const handleAgeChange = (e) => {
    const {value} = e.target;
    setProducer(value);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setactors(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const movieValidationSchema = yup.object({
    name: yup.string().required("*Name field is mandatory").min(3),
    desc: yup.string().required("*Description is mandatory").min(1),
    director: yup.string().required("*Director field is mandatory").min(5),
    poster: yup.string().required("*Poster  is mandatory").min(5),
    yearOfRelease: yup
      .number()
      .required("*Year of release field is mandatory")
      .min(5),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      desc: "",
      director: "",
      poster: "",
      yearOfRelease: "",
      
    },
    validationSchema: movieValidationSchema,
    onSubmit: async(newMovie) => {
      console.log("onSubmit : ", {...newMovie,actors,producer});
      await axios.post(`${backend_API}/movies/add-movie`,{...newMovie,actors,producer});
      navigate("/");
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="formGroup">
        <TextField
          label="Enter the name"
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
          label="Enter the movie Description"
          variant="outlined"
          id="desc"
          name="desc"
          value={formik.values.desc}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.desc && formik.errors.desc}
          helperText={
            formik.touched.desc && formik.errors.desc ? formik.errors.desc : ""
          }
        />
        <TextField
          label="Enter the poster link"
          variant="outlined"
          id="poster"
          name="poster"
          value={formik.values.poster}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.poster && formik.errors.poster}
          helperText={
            formik.touched.poster && formik.errors.name
              ? formik.errors.poster
              : ""
          }
        />
        <TextField
          label="Enter the director name"
          variant="outlined"
          id="director"
          name="director"
          value={formik.values.director}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.director && formik.errors.director}
          helperText={
            formik.touched.director && formik.errors.director
              ? formik.errors.director
              : ""
          }
        />
        <TextField
          label="Enter the year of release"
          variant="outlined"
          id="yearOfRelease"
          name="yearOfRelease"
          value={formik.values.yearOfRelease}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.yearOfRelease && formik.errors.yearOfRelease}
          helperText={
            formik.touched.yearOfRelease && formik.errors.yearOfRelease
              ? formik.errors.yearOfRelease
              : ""
          }
        />
        <FormControl fullWidth>
          <InputLabel id="producer">Producer Name</InputLabel>
          <Select
            labelId="producer"
            id="producer"
            value={producer}
            label="producer"
            onChange={handleAgeChange}
          >
            {
              producerArr.map((prodName)=>{
                return <MenuItem value={prodName._id}>{prodName.name}</MenuItem>
              })
            }
            
          </Select>
        </FormControl>
        <FormControl fullWidth >
          <InputLabel id="actor">Select the Actor names</InputLabel>
          <Select
            labelId="actor"
            id="actor"
            multiple
            value={actors}
            onChange={handleChange}
          >
            {actorNames.map((actor) => (
              <MenuItem key={actor._id} value={actor._id}>
                {actor.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" type="submit">
          Add Movie
        </Button>
      </form>
    </>
  );
}

export default AddMovie;
