// src/TodoList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TodoList.css";
import Modal from "./Modal";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/todos/")
      .then((response) => {
        setTodos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
        setError("Failed to fetch todos");
        setLoading(false);
      });
  }, []);

  // Handle click on todo title
  const handleTodoClick = (todo) => {
    setSelectedTodo(todo);
    setShowModal(true);
  };

  const handleTodoDelete = (id) => {
    axios
      .delete(`http://localhost:8000/todos/${id}/delete/`)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) => console.error("Error deleting todo:", error));
  };

  // Handle form submission for updating the todo
  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:8000/todos/${selectedTodo.id}/update/`,
        selectedTodo
      )
      .then((response) => {
        // Update the todo list with the updated todo
        setTodos(
          todos.map((todo) =>
            todo.id === response.data.id ? response.data : todo
          )
        );
        setShowModal(false); // Close the modal
      })
      .catch((error) => console.error("Error updating todo:", error));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedTodo({
      ...selectedTodo,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (todos.length === 0) {
    return (
      <div className="todo-list">
        <h2 className="title">Todo List</h2>
        <div className="no-todos">No todos found</div>
      </div>
    );
  }

  return (
    <div className="todo-list">
      <h2 className="title">Todo List</h2>
      <ul className="list">
        {todos.map((todo) => (
          <li key={todo.id} className="list-item">
            <div
              onClick={() => handleTodoClick(todo)}
              style={{ cursor: "pointer" }}
              className={`todo-item ${todo.completed ? "completed" : ""}`}
            >
              <strong>{todo.title}</strong>: {todo.description}
            </div>
            <button
              className="delete-button"
              onClick={() => handleTodoDelete(todo.id)}
              style={{
                marginLeft: "auto",
                cursor: "pointer",
                color: "red",
                border: "none",
                background: "none",
              }}
            >
              &#x2716; {/* Cross symbol */}
            </button>
          </li>
        ))}
      </ul>
      {/* Modal for updating todo */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        {selectedTodo && (
          <form onSubmit={handleFormSubmit}>
            <div>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={selectedTodo.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                name="description"
                value={selectedTodo.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="completed">
                <input
                  type="checkbox"
                  id="completed"
                  name="completed"
                  checked={selectedTodo.completed}
                  onChange={handleInputChange}
                />
                Completed
              </label>
            </div>
            <button type="submit">Update Todo</button>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default TodoList;
