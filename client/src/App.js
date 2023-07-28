import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar.jsx';
import AddLink from './components/AddLink.jsx';
import Home from './components/Home.jsx';
import State from './context/state.js';

const App = () => {

  return (
    <State>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddLink />} />
        </Routes>
      </Router>
    </State>
  );
};

export default App;
