// src/App.js
import React from 'react';
import './App.css';
import Index from './components/index'; // Import the TodoList component

function App() {
  return (
    <div className="App">
      <Index /> {/* Use the TodoList component to display the list of todos */}
    </div>
  );
}

export default App;
