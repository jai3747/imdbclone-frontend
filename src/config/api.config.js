
// // // src/config/api.config.js
// // import axios from 'axios';

// // const BASE_URL = process.env.REACT_APP_API_URL || 'http://34.47.168.225:5000';

// // export const apiClient = axios.create({
// //   baseURL: BASE_URL,
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// //   timeout: 10000,
// // });

// // export const api = {
// //   movies: {
// //     getAll: () => apiClient.get('/api/movies'),
// //     getById: (id) => apiClient.get(`/api/movies/${id}`),
// //     add: (movie) => apiClient.post('/api/movies/add-movie', movie),
// //     update: (id, movie) => apiClient.put(`/api/movies/edit-movie/${id}`, movie),
// //     delete: (id) => apiClient.delete(`/api/movies/delete-movie/${id}`)
// //   },
// //   actors: {
// //     getAll: () => apiClient.get('/api/actors'),
// //     add: (actor) => apiClient.post('/api/actors/add-actor', actor)
// //   },
// //   producers: {
// //     getAll: () => apiClient.get('/api/producers'),
// //     add: (producer) => apiClient.post('/api/producers/add-producer', producer)
// //   }
// // };
// // src/config/api.config.js
// import axios from 'axios';

// // Environment configuration
// const config = {
//   apiUrl: process.env.REACT_APP_API_URL || 'http://34.47.200.74:5000',
//   environment: process.env.NODE_ENV || 'development',
//   timeout: 10000,
//   retryAttempts: 3,
//   retryDelay: 1000,
// };

// // Create axios instance with default config
// const apiClient = axios.create({
//   baseURL: config.apiUrl,
//   timeout: config.timeout,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
// });

// // Request interceptor
// apiClient.interceptors.request.use(
//   (config) => {
//     // Add any auth tokens if needed
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Implement retry logic
//     if (error.response && !originalRequest._retry && originalRequest.retryCount < config.retryAttempts) {
//       originalRequest._retry = true;
//       originalRequest.retryCount = (originalRequest.retryCount || 0) + 1;

//       await new Promise(resolve => setTimeout(resolve, config.retryDelay));
//       return apiClient(originalRequest);
//     }

//     // Handle specific error cases
//     if (error.response) {
//       switch (error.response.status) {
//         case 401:
//           // Handle unauthorized
//           localStorage.removeItem('token');
//           window.location.href = '/login';
//           break;
//         case 403:
//           // Handle forbidden
//           break;
//         case 404:
//           // Handle not found
//           break;
//         case 500:
//           // Handle server error
//           break;
//         default:
//           break;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// // API endpoints configuration
// export const api = {
//   // Movies endpoints
//   movies: {
//     getAll: (params) => apiClient.get('/api/movies', { params }),
//     getById: (id) => apiClient.get(`/api/movies/${id}`),
//     create: (movie) => apiClient.post('/api/movies', movie),
//     update: (id, movie) => apiClient.put(`/api/movies/${id}`, movie),
//     delete: (id) => apiClient.delete(`/api/movies/${id}`),
//     // Add pagination, filtering, and sorting support
//     getPaginated: (page = 1, limit = 10, filters = {}, sort = '') => 
//       apiClient.get('/api/movies', {
//         params: {
//           page,
//           limit,
//           ...filters,
//           sort,
//         },
//       }),
//   },

//   // Actors endpoints
//   actors: {
//     getAll: (params) => apiClient.get('/api/actors', { params }),
//     getById: (id) => apiClient.get(`/api/actors/${id}`),
//     create: (actor) => apiClient.post('/api/actors', actor),
//     update: (id, actor) => apiClient.put(`/api/actors/${id}`, actor),
//     delete: (id) => apiClient.delete(`/api/actors/${id}`),
//   },

//   // Producers endpoints
//   producers: {
//     getAll: (params) => apiClient.get('/api/producers', { params }),
//     getById: (id) => apiClient.get(`/api/producers/${id}`),
//     create: (producer) => apiClient.post('/api/producers', producer),
//     update: (id, producer) => apiClient.put(`/api/producers/${id}`, producer),
//     delete: (id) => apiClient.delete(`/api/producers/${id}`),
//   },

//   // Health check endpoints
//   health: {
//     checkLiveness: () => apiClient.get('/health/live'),
//     checkReadiness: () => apiClient.get('/health/ready'),
//   },
// };

// // Error handling utility
// export const handleApiError = (error) => {
//   const errorResponse = {
//     message: 'An error occurred',
//     status: 500,
//     details: null,
//   };

//   if (error.response) {
//     // Server responded with error
//     errorResponse.message = error.response.data.message || error.response.data.error || 'Server error';
//     errorResponse.status = error.response.status;
//     errorResponse.details = error.response.data;
//   } else if (error.request) {
//     // Request made but no response
//     errorResponse.message = 'No response from server';
//     errorResponse.status = 503;
//   } else {
//     // Request setup error
//     errorResponse.message = error.message;
//     errorResponse.status = 400;
//   }

//   return errorResponse;
// };

// // Usage example helper
// export const apiExample = {
//   async fetchMovies() {
//     try {
//       const response = await api.movies.getPaginated(1, 10, { genre: 'Action' }, 'releaseYear:desc');
//       return response.data;
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   },
// };

// export default api;
// src/config/api.config.js
import axios from 'axios';

// Environment configuration
const config = {
  // Use process.env.REACT_APP_API_URL and fallback to the production IP if not set
  apiUrl: process.env.REACT_APP_API_URL || 'http://34.47.200.74:5000',
  environment: process.env.NODE_ENV || 'development',
  timeout: 15000, // Increased timeout
  retryAttempts: 3,
  retryDelay: 1000,
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: config.apiUrl,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth tokens if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Initialize retry count
    config.retryCount = 0;
    
    console.log(`API Request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.error(`API Error (${originalRequest?.url}):`, error.message);

    // Implement retry logic
    if (error.response && originalRequest && !originalRequest._retry && 
        (originalRequest.retryCount || 0) < config.retryAttempts) {
      
      originalRequest._retry = true;
      originalRequest.retryCount = (originalRequest.retryCount || 0) + 1;
      
      console.log(`Retrying request (${originalRequest.retryCount}/${config.retryAttempts}): ${originalRequest.url}`);
      await new Promise(resolve => setTimeout(resolve, config.retryDelay));
      return apiClient(originalRequest);
    }

    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          localStorage.removeItem('token');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          console.warn('Access forbidden');
          break;
        case 404:
          console.warn('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error - no response received');
    } else {
      // Something happened in setting up the request
      console.error('Request setup error');
    }

    return Promise.reject(error);
  }
);

// API endpoints configuration
export const api = {
  // Movies endpoints
  movies: {
    getAll: (params) => apiClient.get('/api/movies', { params }),
    getById: (id) => apiClient.get(`/api/movies/${id}`),
    create: (movie) => apiClient.post('/api/movies', movie),
    update: (id, movie) => apiClient.put(`/api/movies/${id}`, movie),
    delete: (id) => apiClient.delete(`/api/movies/${id}`),
    // Add pagination, filtering, and sorting support
    getPaginated: (page = 1, limit = 10, filters = {}, sort = '') => 
      apiClient.get('/api/movies', {
        params: {
          page,
          limit,
          ...filters,
          sort,
        },
      }),
  },

  // Actors endpoints
  actors: {
    getAll: (params) => apiClient.get('/api/actors', { params }),
    getById: (id) => apiClient.get(`/api/actors/${id}`),
    create: (actor) => apiClient.post('/api/actors', actor),
    update: (id, actor) => apiClient.put(`/api/actors/${id}`, actor),
    delete: (id) => apiClient.delete(`/api/actors/${id}`),
  },

  // Producers endpoints
  producers: {
    getAll: (params) => apiClient.get('/api/producers', { params }),
    getById: (id) => apiClient.get(`/api/producers/${id}`),
    create: (producer) => apiClient.post('/api/producers', producer),
    update: (id, producer) => apiClient.put(`/api/producers/${id}`, producer),
    delete: (id) => apiClient.delete(`/api/producers/${id}`),
  },

  // Health check endpoints - important for connectivity testing
  health: {
    checkLiveness: () => apiClient.get('/health/live'),
    checkReadiness: () => apiClient.get('/health/ready'),
  },
};

// Error handling utility
export const handleApiError = (error) => {
  const errorResponse = {
    message: 'An error occurred',
    status: 500,
    details: null,
  };

  if (error.response) {
    // Server responded with error
    errorResponse.message = error.response.data.message || error.response.data.error || 'Server error';
    errorResponse.status = error.response.status;
    errorResponse.details = error.response.data;
  } else if (error.request) {
    // Request made but no response
    errorResponse.message = 'No response from server. Please check your connection.';
    errorResponse.status = 503;
  } else {
    // Request setup error
    errorResponse.message = error.message;
    errorResponse.status = 400;
  }

  return errorResponse;
};

export default api;
