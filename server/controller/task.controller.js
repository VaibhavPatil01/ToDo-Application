import Task from '../models/Task.js';

export const createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const userId = req.userId;

        const task = await Task.create({
            title,
            description: description || '',
            status: status || 'pending',
            userId
        });

        res.status(201).json({
            message: 'Task created successfully',
            task
        });

    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ error: 'Server error while creating task' });
    }
};

export const getTasks = async (req, res) => {
    try {
        const userId = req.userId;

        const tasks = await Task.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Tasks retrieved successfully',
            tasks,
            count: tasks.length
        });

    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ error: 'Server error while fetching tasks' });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
        const userId = req.userId;

        let task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (task.userId.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'Not authorized to update this task' });
        }

        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description;
        task.status = status || task.status;
        
        const updatedTask = await task.save();

        res.status(200).json({
            message: 'Task updated successfully',
            task: updatedTask
        });

    } catch (error) {
        console.error('Update task error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid task ID' });
        }
        res.status(500).json({ error: 'Server error while updating task' });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (task.userId.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'Not authorized to delete this task' });
        }

        await Task.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Task deleted successfully',
            taskId: id
        });

    } catch (error) {
        console.error('Delete task error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid task ID' });
        }
        res.status(500).json({ error: 'Server error while deleting task' });
    }
};