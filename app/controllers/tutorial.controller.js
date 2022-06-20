const db = require("../models");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;
//create and save new tutorial
exports.create = (req, res) =>{
//Validate
if(!req.body.title){
    res.status(400).send({
        message: "Content can not be empty!"
    });
    return;
};

//create a tutorial
const tutorial = {
    title: req.body.title,
    description:req.body.description,
    published: req.body.published? req.body.published: false
};

//save new tutorial in db
Tutorial.create(tutorial)
.then(data=>{
    res.send(data);
})
.catch(err=>{
    res.status(500).send({
        message: err.message || "Some error occured when creating the tutorial."
    });
});

};

//get all tutorials
exports.findAll = (req, res) =>{
    const title = req.query.title;
    let condition = title? {title: { [Op.like] : `%${title}%`}} : null;
    Tutorial.findAll({where : condition})
    .then(data=>{
        res.send(data);
    })
    .catch(err =>{
        res.status(500).send({
            message: err.message || "Some error occured when retrieving tutorials"
        });
    });

};

//single turtorial
exports.findOne = (req,res) =>{
    const id = req.params.id;
    Tutorial.findByPk(id)
    .then(data=>{
        if(data){
            res.send(data);
        }else{
            res.status(404).send({
                message:"Error retrieving Tutorial with id=" + id
            });
        }
    })
    .catch(err=>{
        res.status(500).send({
            message: "Error retrieving Tutorial with id=" + id
        });
    });

};

exports.update = (req,res) =>{
    const id = req.params.id;
    Tutorial.update(req.body, {
        where: {id:id}
    })
    .then(num =>{
        if(num ==1){
            res.send({
                message: "Tutorial was updated successfully."
            });
        }
        else{
            res.send({
                message: `Cannot update Tutorial with ${id}, maybe the tutorial was not found or the body was empty`
            })
        }
    })
    .catch(err =>{
        res.status(500).send({
            message: `Eror updating Tutorial with id= ${id}`
        })
    })

};
//delete one with a specified id
exports.delete =(req,res)=>{
const id = req.params.id;
Tutorial.destroy({
    where: {id : id}
})
.then(num => {
    if(num== 1){
        res.send({
            message: "Tutorial was deleted successfully!"
        });
    }else{
        res.send({
            message: `Cannot delete tutorial of id ${id}. Maybe tutorial was not found.` 
        });
    }
})
.catch(err =>{
    res.status(500).send({
        message: `Could not delete tutorial with id= ${id}`
    })
})

};
//delete all tutorials
exports.deleteAll=(req,res) =>{
    Tutorial.destroy({
        where: {},
        truncate: false
    })
    .then(nums =>{
        res.send({
            message: "All Tutorial were successfully deleted"
        })
    })
    .catch(err=>{
        res.send(500).send({
            message: err.message || "Some error occured while removing all Tutorials"
        })
    })

};
//get all published tutorials
exports.findAllPublished =(req,res) =>{
    Tutorial.findAll({ where : { published:true}})
    .then(data =>{
        res.send(data);
    })
    .catch(err=>{
        res.status(500).send({
            message: err.message || "Some eror occured while retrieving tutorials"
        })
    })

};

