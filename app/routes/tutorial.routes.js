module.exports = app =>{
    const tutorials = require('../controllers/tutorial.controller');
    var router = require('express').Router();
    //create  new tutorial
    router.post('/', tutorials.create);

    //get all tutorials
    router.get('/',tutorials.findAll);

    //get one with id
    router.get('/:id', tutorials.findOne);

    //update with id
    router.put('/:id', tutorials.update);

    //delete one tutorial with id
    router.delete('/:id', tutorials.delete);

    //delete all tutorials
    router.delete('/', tutorials.deleteAll);
    app.use('/tutorials', router)
}