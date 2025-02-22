// app.js
import './App.css';
import { ThemeProvider } from '@emotion/react';
import { 
  AppBar, 
  Button, 
  Paper, 
  Toolbar, 
  createTheme,
  CircularProgress,
  Snackbar,
  Alert 
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import AddMovie from './AddMovie';
import Movie from './Movie';
import AddActor from './AddActor';
import AddProducer from './AddProducer';
import EditMovies from './EditMovies';

function App() {
  const [mode, setMode] = useState(() => localStorage.getItem('theme') || "dark");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: mode === 'dark' ? '#90caf9' : '#1976d2',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#ffffff',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
  });

  const handleError = (error) => {
    console.error('Application error:', error);
    setError(error.message || 'An unexpected error occurred');
    setLoading(false);
  };

  const handleCloseError = () => {
    setError(null);
  };

  const navigationItems = [
    { path: "/", label: "All Movies" },
    { path: "/add-movies", label: "Add Movies" },
    { path: "/add-actor", label: "Add Actor" },
    { path: "/add-producer", label: "Add Producer" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Paper 
        className="paper" 
        elevation={5} 
        style={{ 
          borderRadius: "0px", 
          minHeight: "100vh",
          position: "relative" 
        }}
      >
        <AppBar className="nav-bar" position="static">
          <Toolbar>
            <Button
              onClick={() => navigate("/")}
              color="inherit"
              sx={{ mr: 2 }}
            >
              <span className='logo'>IMDB</span>
            </Button>

            {navigationItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                color="inherit"
                sx={{ mr: 1 }}
              >
                {item.label}
              </Button>
            ))}

            <Button
              sx={{ marginLeft: "auto" }}
              startIcon={mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              onClick={() => setMode(mode === "light" ? "dark" : "light")}
              color="inherit"
            >
              {mode === "light" ? "Dark" : "Light"} Mode
            </Button>
          </Toolbar>
        </AppBar>

        {loading && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000
          }}>
            <CircularProgress />
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={<Movie setLoading={setLoading} onError={handleError} />}
          />
          <Route
            path="/add-movies"
            element={<AddMovie setLoading={setLoading} onError={handleError} />}
          />
          <Route
            path="/add-actor"
            element={<AddActor setLoading={setLoading} onError={handleError} />}
          />
          <Route
            path="/add-producer"
            element={<AddProducer setLoading={setLoading} onError={handleError} />}
          />
          <Route
            path="movies/edit/:id"
            element={<EditMovies setLoading={setLoading} onError={handleError} />}
          />
        </Routes>

        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseError} severity="error" variant="filled">
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
