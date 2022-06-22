module.exports = app =>{
    const users = require('../controllers/user.contoller');
    let router = require('express').Router()
    // registration
    router.post('/', users.register);

    //login
    router.post('/login', users.login);

    //update user info
    router.put('/:id', users.update);

    //delete single user
    router.delete('/:id', users.delete);

    //get one user
    router.get('/:id', users.findOne);

    //get all users
    router.get('/', users.findAll);

    
    app.use('/user',router)
}