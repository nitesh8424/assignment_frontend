import React, { useState } from 'react';
import './App.css';
import User from './pages/User';
import { io } from "socket.io-client";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';

const socket = io("http://localhost:4000");

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="admin" element={<Admin />} />
        <Route path="user" element={<User socket={socket} />} />
        <Route path="/" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
