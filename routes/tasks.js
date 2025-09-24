// const express = require('express');
// const router = express.Router();

const router = require('express').Router();

const tasksController = require('../controllers/tasks');
const { isAuthenticated } = require('../middleware/authenticated');

// Task routes: CRUD operations for tasks
router.get('/', tasksController.getAllTasks);
router.get('/:id', tasksController.getTaskById);
router.post('/', isAuthenticated, tasksController.createTask);
router.put('/:id', isAuthenticated, tasksController.updateTask);
router.delete('/:id', isAuthenticated, tasksController.deleteTask);

module.exports = router;