const db = require("../models");
const dotenv = require('dotenv');
const User = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

exports.register = async (req,res)=>{
    const { email, password } =  req.body
    if(password.length < 6){
        res.status(400).send({message: "Password cannot be less that 6 characters"})
    }


 // hashing the password
    bcrypt.hash(password, 10).then(async (hash)=>{
        const user ={
            email,
            password: hash
        }

   await User.create(user)
    .then(data =>{
        const maxAge =  3*60*60 //3hr in seconds
        const token = jwt.sign(
            { id:data._id, email },
            secret,
            {
                expiresIn: maxAge
            }
        );
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000 // 3hrs in milliseconds
        })
        res.status(200).send({
            message: "User successfully created",
            data: data._id
        });
    })
    .catch(err=>{
        res.status(401).send({
            mesaage: err.message || "User not successfully created"
        })
    })
})
}

exports.login = async(req,res) =>{
    const { email, password } = req.body;
    if(!email || !password ){
        res.status(400).send({
            message: "Email or password not present"
        })
        return;

    }
    try{
        const user = await User.findOne({email})
        if(!user){
            res.status(401).send({
                message: "Login not successful",
                error: "User not found" 
            })
        }else{

            bcrypt.compare(password, user.password).then(result=>{
                result
                ?  res.status(200).send({
                    message: "Login successful",
                    user
                })
                :res.status(400).send({
                    message:  `Login not successfull. Username or password do not match`
                })
            })
           
        }
    }
    catch(error){
        res.status(500).send({
            message : error.message || "An error occured during login"
        })

    }

}

exports.update = async (req, res) =>{
    const id = req.params.id;
    const email = req.body.email
    await User.update(req.body, {
        where: {id:id}
    })
    .then(num=>{
        if(num == 1){
            res.status(200).send({
                message: "User was updated successfully"
            })
        }else{
            res.send({
                message: `User with id ${id} could not be updated. The user may not be present or the the body is empty`
            })
        }

    })
    .catch(err =>{
        res.status(500).send({
            message: err.message || ` There was an error updating user ${email}`
        })
    })

}

exports.delete = async (req, res)=>{
    const id = req.params.id;
    await User.findByPk(id)
    .then(user => user.remove())
    .then(user =>{
        res.status(200).send({
            message: "User successfully deleted"
        })
    })
    .catch(err =>{
        res.status(500).send({
            message: err.mesaage || `Cannot delete user of id ${id}`
        })
    })
}

exports.findOne = async (req, res) =>{
const id = req.params.id;
await User.findByPk(id)
.then(data=>{
    if(data){
        res.send(data)
    }
    else{
        res.status(400).send({
            mesaage: ` User with id ${id} cannot be found`
        })
    }

})
.catch(err =>{
    res.status(500).send({
        message : err.mesaage || `There was a problem trying to find user ${id}`
    })
})
}

exports.findAll = (req, res) =>{
    const email = req.query.email;
    let condition = email? {email: { [Op.like] : `%${email}%`}}: null;
    User.findAll({ where: condition})
    .then(data =>{
        if(data){
            res.send(data);
        }
        else{
            res.status(400).send({
                message: "There are no users found"
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.mesaage || "There was a problem trying to get all users"
        })
    })
}