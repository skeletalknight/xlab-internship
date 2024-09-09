import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import Welcome from './pages/SetName/SetName.tsx';
import ChatRoom from './pages/ChatRoom/ChatRoom.tsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Welcome/>} />
        <Route path="/room" element={<ChatRoom/>} />
        <Route
        path="/"
        element={<Navigate to="/login" replace />}
    />
      </Routes>
    </BrowserRouter>
  );
}

export default App
