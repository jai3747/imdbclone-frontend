
// src/config/api.config.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://34.47.168.225:5000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  movies: {
    getAll: () => apiClient.get('/api/movies'),
    getById: (id) => apiClient.get(`/api/movies/${id}`),
    add: (movie) => apiClient.post('/api/movies/add-movie', movie),
    update: (id, movie) => apiClient.put(`/api/movies/edit-movie/${id}`, movie),
    delete: (id) => apiClient.delete(`/api/movies/delete-movie/${id}`)
  },
  actors: {
    getAll: () => apiClient.get('/api/actors'),
    add: (actor) => apiClient.post('/api/actors/add-actor', actor)
  },
  producers: {
    getAll: () => apiClient.get('/api/producers'),
    add: (producer) => apiClient.post('/api/producers/add-producer', producer)
  }
};
