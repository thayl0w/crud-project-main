const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllEmployees = async (req, res) => {
    //#swagger.tags = ['Employees']
    try {
        const result = await mongodb.getDatabase().db('crud-project').collection('employees').find();
        const employees = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(employees);
    } catch (error) {
        console.error('Error getting all employees:', error);
        res.status(500).json({ error: 'Internal server error while retrieving employees' });
    }
};

const getEmployeeById = async (req, res) => {
    //#swagger.tags = ['Employees']
    try {
        const employeeId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db('crud-project').collection('employees').find({ _id: employeeId });
        const employees = await result.toArray();
        
        if (employees.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(employees[0]);
    } catch (error) {
        console.error('Error getting employee by ID:', error);
        if (error.name === 'BSONTypeError') {
            return res.status(400).json({ error: 'Invalid employee ID format' });
        }
        res.status(500).json({ error: 'Internal server error while retrieving employee' });
    }
};

const createEmployee = async (req, res) => {
    //#swagger.tags = ['Employees']
    try {
        // Validate required fields
        const { name, email, role, department, status, dateHired, phone } = req.body;
        
        if (!name || !email || !role || !department) {
            return res.status(400).json({ error: 'Missing required fields: name, email, role, and department are required' });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        
        const employee = {
            name,
            email,
            role,
            department,
            status: status || 'active',
            dateHired: dateHired || new Date(),
            phone: phone || ''
        };
        
        const response = await mongodb.getDatabase().db('crud-project').collection('employees').insertOne(employee);
        
        if (response.acknowledged) {
            res.status(201).json({ 
                message: 'Employee created successfully',
                id: response.insertedId,
                employee: employee
            });
        } else {
            res.status(500).json({ error: 'Failed to create employee' });
        }
    } catch (error) {
        console.error('Error creating employee:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Employee with this email already exists' });
        }
        res.status(500).json({ error: 'Internal server error while creating employee' });
    }
};

const updateEmployee = async (req, res) => {
    //#swagger.tags = ['Employees']
    try {
        const employeeId = new ObjectId(req.params.id);
        const { name, email, role, department, status, dateHired, phone } = req.body;
        
        // Validate required fields
        if (!name || !email || !role || !department) {
            return res.status(400).json({ error: 'Missing required fields: name, email, role, and department are required' });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        
        const employee = {
            name,
            email,
            role,
            department,
            status: status || 'active',
            dateHired: dateHired || new Date(),
            phone: phone || ''
        };
        
        const response = await mongodb.getDatabase().db('crud-project').collection('employees').replaceOne({ _id: employeeId }, employee);
        
        if (response.matchedCount === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        if (response.modifiedCount > 0) {
            res.status(200).json({ 
                message: 'Employee updated successfully',
                id: employeeId,
                employee: employee
            });
        } else {
            res.status(200).json({ 
                message: 'Employee data unchanged',
                id: employeeId,
                employee: employee
            });
        }
    } catch (error) {
        console.error('Error updating employee:', error);
        if (error.name === 'BSONTypeError') {
            return res.status(400).json({ error: 'Invalid employee ID format' });
        }
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Employee with this email already exists' });
        }
        res.status(500).json({ error: 'Internal server error while updating employee' });
    }
};

const deleteEmployee = async (req, res) => {
    //#swagger.tags = ['Employees']
    try {
        const employeeId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db('crud-project').collection('employees').deleteOne({ _id: employeeId });
        
        if (response.deletedCount === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        res.status(200).json({ 
            message: 'Employee deleted successfully',
            id: employeeId
        });
    } catch (error) {
        console.error('Error deleting employee:', error);
        if (error.name === 'BSONTypeError') {
            return res.status(400).json({ error: 'Invalid employee ID format' });
        }
        res.status(500).json({ error: 'Internal server error while deleting employee' });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};