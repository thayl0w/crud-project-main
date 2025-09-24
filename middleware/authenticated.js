// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user === undefined) {
        return res.status(401).json('You do not have access to this resource. Please log in first');
    }
    next();
};

module.exports = {
    isAuthenticated
};