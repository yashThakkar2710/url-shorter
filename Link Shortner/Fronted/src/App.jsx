import React from 'react';
import { UserContext } from './context/UserContext.jsx';
import { useContext } from 'react';
import { UserContextProvider } from './context/UserContext.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import Register from './components/Register.jsx';
import UpdateUrl from './components/UpdateUrl.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home  />} />
          <Route path="/update/:userId" element={<UpdateUrl />} />
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

// Protected Route Component
const ProtectedRoute = () => {
  const { userAuth } = useContext(UserContext);
  return userAuth ? <Home /> : <Navigate to="/login" />;
};

export default App;
