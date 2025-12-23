import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import Login from "./components/Login";
import TaskList from "./components/TaskList";
import Navbar from "./components/Navbar";

const App = () => {
  const { user, loading } = useContext(AppContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
      {user && <Navbar />}
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <Login />} 
        />
        <Route 
          path="/" 
          element={user ? <TaskList /> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;