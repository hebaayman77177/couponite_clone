
const userController = require('../controllers/user-controller');
const router = require('express').Router();

router.post('/add', userController.create);


module.exports = router;