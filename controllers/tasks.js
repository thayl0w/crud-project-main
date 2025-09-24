const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllTasks = async (req, res) => {
    //#swagger.tags = ['Tasks']
    try {
        const result = await mongodb.getDatabase().db('crud-project').collection('Tasks').find();
        const Tasks = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(Tasks);
    } catch (error) {
        console.error('Error getting all Tasks:', error);
        res.status(500).json({ error: 'Internal server error while retrieving Tasks' });
    }
};

const getTaskById = async (req, res) => {
    //#swagger.tags = ['Tasks']
    try {
        const taskId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db('crud-project').collection('Tasks').find({ _id: taskId });
        const Tasks = await result.toArray();
        
        if (Tasks.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(Tasks[0]);
    } catch (error) {
        console.error('Error getting task by ID:', error);
        if (error.name === 'BSONTypeError') {
            return res.status(400).json({ error: 'Invalid task ID format' });
        }
        res.status(500).json({ error: 'Internal server error while retrieving task' });
    }
};

const createTask = async (req, res) => {
    //#swagger.tags = ['Tasks']
    try {
        // Validate required fields
        const { title, description, assignedTo, priority, status, dueDate, remarks } = req.body;
        
        if (!title || !description || !assignedTo) {
            return res.status(400).json({ error: 'Missing required fields: title, description, and assignedTo are required' });
        }
        
        // Validate priority
        const validPriorities = ['low', 'medium', 'high', 'urgent'];
        if (priority && !validPriorities.includes(priority.toLowerCase())) {
            return res.status(400).json({ error: 'Invalid priority. Must be one of: low, medium, high, urgent' });
        }
        
        // Validate status
        const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
        if (status && !validStatuses.includes(status.toLowerCase())) {
            return res.status(400).json({ error: 'Invalid status. Must be one of: pending, in-progress, completed, cancelled' });
        }
        
        // Validate due date
        if (dueDate && isNaN(new Date(dueDate).getTime())) {
            return res.status(400).json({ error: 'Invalid due date format' });
        }
        
        const task = {
            title,
            description,
            assignedTo,
            priority: priority || 'medium',
            status: status || 'pending',
            dueDate: dueDate ? new Date(dueDate) : null,
            createdAt: new Date(),
            updatedAt: new Date(),
            remarks: remarks || ''
        };
        
        const response = await mongodb.getDatabase().db('crud-project').collection('Tasks').insertOne(task);
        
        if (response.acknowledged) {
            res.status(201).json({ 
                message: 'Task created successfully',
                id: response.insertedId,
                task: task
            });
        } else {
            res.status(500).json({ error: 'Failed to create task' });
        }
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal server error while creating task' });
    }
};

const updateTask = async (req, res) => {
    //#swagger.tags = ['Tasks']
    try {
        const taskId = new ObjectId(req.params.id);
        const { title, description, assignedTo, priority, status, dueDate, remarks } = req.body;
        
        // Validate required fields
        if (!title || !description || !assignedTo) {
            return res.status(400).json({ error: 'Missing required fields: title, description, and assignedTo are required' });
        }
        
        // Validate priority
        const validPriorities = ['low', 'medium', 'high', 'urgent'];
        if (priority && !validPriorities.includes(priority.toLowerCase())) {
            return res.status(400).json({ error: 'Invalid priority. Must be one of: low, medium, high, urgent' });
        }
        
        // Validate status
        const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
        if (status && !validStatuses.includes(status.toLowerCase())) {
            return res.status(400).json({ error: 'Invalid status. Must be one of: pending, in-progress, completed, cancelled' });
        }
        
        // Validate due date
        if (dueDate && isNaN(new Date(dueDate).getTime())) {
            return res.status(400).json({ error: 'Invalid due date format' });
        }
        
        const task = {
            title,
            description,
            assignedTo,
            priority: priority || 'medium',
            status: status || 'pending',
            dueDate: dueDate ? new Date(dueDate) : null,
            updatedAt: new Date(),
            remarks: remarks || ''
        };
        
        const response = await mongodb.getDatabase().db('crud-project').collection('Tasks').replaceOne({ _id: taskId }, task);
        
        if (response.matchedCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        if (response.modifiedCount > 0) {
            res.status(200).json({ 
                message: 'Task updated successfully',
                id: taskId,
                task: task
            });
        } else {
            res.status(200).json({ 
                message: 'Task data unchanged',
                id: taskId,
                task: task
            });
        }
    } catch (error) {
        console.error('Error updating task:', error);
        if (error.name === 'BSONTypeError') {
            return res.status(400).json({ error: 'Invalid task ID format' });
        }
        res.status(500).json({ error: 'Internal server error while updating task' });
    }
};

const deleteTask = async (req, res) => {
    //#swagger.tags = ['Tasks']
    try {
        const taskId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db('crud-project').collection('Tasks').deleteOne({ _id: taskId });
        
        if (response.deletedCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.status(200).json({ 
            message: 'Task deleted successfully',
            id: taskId
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        if (error.name === 'BSONTypeError') {
            return res.status(400).json({ error: 'Invalid task ID format' });
        }
        res.status(500).json({ error: 'Internal server error while deleting task' });
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};