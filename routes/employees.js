// const express = require('express');
// const router = express.Router();

const router = require('express').Router();

const employeesController = require('../controllers/employees');
const { isAuthenticated } = require('../middleware/authenticated');

router.get('/', employeesController.getAllEmployees);
router.get('/:id', employeesController.getEmployeeById);
router.post('/', isAuthenticated, employeesController.createEmployee);
router.put('/:id', isAuthenticated, employeesController.updateEmployee);
router.delete('/:id', isAuthenticated, employeesController.deleteEmployee);

module.exports = router;