import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Stream from './pages/stream';
import EditProfile from './pages/editProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:profileId/edit" element={<EditProfile />} />
        <Route path="/profile/:profileId" element={<Stream />} />
      </Routes>
    </Router>
  );
}

export default App;