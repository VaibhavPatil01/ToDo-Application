import { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";

const TaskList = () => {
  const { tasks, createTask, updateTask, deleteTask, loadTasks } = useContext(AppContext);
  
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const taskData = { title, description };
    let result;

    if (editingTask) {
      result = await updateTask(editingTask._id, taskData);
    } else {
      result = await createTask(taskData);
    }

    if (result && !result.success) {
      setError(result.error);
    } else {
      resetForm();
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(taskId);
    }
  };

  // Toggle task completion status
  const toggleComplete = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    const taskData = {
      title: task.title,
      description: task.description,
      status: newStatus
    };
    
    await updateTask(task._id, taskData);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditingTask(null);
    setShowForm(false);
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Todo List</h1>
        <p className="text-gray-600">
          Manage your daily tasks efficiently
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Add Task Button */}
      <div className="mb-6 flex justify-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
        >
          {showForm ? "Cancel" : "Add New Task"}
        </button>
      </div>

      {/* Task Form */}
      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingTask ? "Edit Task" : "Create New Task"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                rows="3"
                placeholder="Enter task description (optional)"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {editingTask ? "Update Task" : "Create Task"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {tasks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks yet</h3>
            <p className="text-gray-500">Click "Add New Task" to create your first task!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <div 
                key={task._id} 
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  task.status === 'completed' ? 'bg-green-50' : ''
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg font-semibold ${
                        task.status === 'completed' 
                          ? 'text-green-800 line-through' 
                          : 'text-gray-800'
                      }`}>
                        {task.title}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        task.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className={`text-sm mb-3 ${
                        task.status === 'completed' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {task.description}
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      Created: {new Date(task.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="flex gap-2 hrink-0">
                    <button
                      onClick={() => toggleComplete(task)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        task.status === 'completed'
                          ? 'bg-gray-500 text-white hover:bg-gray-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>
                    
                    <button
                      onClick={() => handleEdit(task)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      {tasks.length > 0 && (
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>
            Completed: {tasks.filter(t => t.status === 'completed').length} / {tasks.length}
            <span className="mx-2">•</span>
            Pending: {tasks.filter(t => t.status !== 'completed').length} / {tasks.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;