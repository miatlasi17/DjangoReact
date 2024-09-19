// src/AddTodo.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AddTodo.css'

function AddTodo() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/todos/create/', { title, description, completed })
      .then(() => {
        navigate('/'); // Redirect to the todo list after successful submission
      })
      .catch((error) => {
        console.error('Error adding todo:', error);
        setError('Failed to add todo');
      });
  };

  return (
    <div className="add-todo">
      <h2>Add New Todo</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="completed">
            <input
              type="checkbox"
              id="completed"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            Completed
          </label>
        </div>
        <button type="submit">Add Todo</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}

export default AddTodo;
