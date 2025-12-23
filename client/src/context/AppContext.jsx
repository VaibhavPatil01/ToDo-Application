import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const backendUrl = import.meta.env.REACT_APP_API_URL || "http://localhost:3000";

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      loadTasks();
    } else {
      setLoading(false);
    }
  }, []);

  const loadTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${backendUrl}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.tasks) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/auth/login`, {
        email,
        password
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        await loadTasks();
        navigate("/");
        return { success: true, data };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || "Login failed" 
      };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/auth/register`, {
        name,
        email,
        password
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate("/");
        return { success: true, data };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || "Registration failed" 
      };
    }
  };

  // Create task
  const createTask = async (taskData) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(`${backendUrl}/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.task) {
        await loadTasks();
        return { success: true, data };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || "Failed to create task" 
      };
    }
  };

  // Update task
  const updateTask = async (id, taskData) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(`${backendUrl}/tasks/${id}`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.task) {
        await loadTasks();
        return { success: true, data };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || "Failed to update task" 
      };
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(`${backendUrl}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.message) {
        await loadTasks();
        return { success: true, data };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || "Failed to delete task" 
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setTasks([]);
    navigate("/login");
  };

  const value = {
    user,
    setUser,
    tasks,
    setTasks,
    loading,
    setLoading,
    error,
    setError,
    backendUrl,
    login,
    register,
    createTask,
    updateTask,
    deleteTask,
    loadTasks,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};