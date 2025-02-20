// src/MovieCard.js
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Typography, 
  IconButton 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export const MovieCard = ({ 
  _id,
  name,
  desc,
  director,
  yearOfRelease,
  poster,
  producer,
  actors,
  onDelete,
  onEdit 
}) => {
  return (
    <Card className="movie-card">
      <CardMedia
        component="img"
        height="140"
        image={poster}
        alt={name}
      />
      <CardContent>
        <Typography variant="h5">{name}</Typography>
        <Typography variant="body2">{desc}</Typography>
        <Typography variant="body2">
          {actors.map((actor, index) => (
            <span key={actor._id}>
              {actor.name}{index < actors.length - 1 ? ', ' : ''}
            </span>
          ))}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton onClick={onEdit} color="primary">
          <EditIcon />
        </IconButton>
        <IconButton onClick={onDelete} color="error">
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
