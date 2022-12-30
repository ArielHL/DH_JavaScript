
const path = require('path');
const { Op } = require("sequelize");

// const User = require('../models/User');

const db = require('../database/models');
const Users = db.Users;
const Country = db.Country;
const UserRol = db.UserRol;


const {validationResult} = require('express-validator');
const { userInfo } = require('os');
const bcryptjs = require('bcryptjs');

//const renderHome = (req, res) => {
 //   return res.render('home')
//}

//const renderAbout = (req, res) => {
  //  return res.render('about')
//}

const register = async (req, res) => {
    
    const countries = await Country.findAll();
    const userRoles = await UserRol.findAll();
    
    return res.render('users/register',{countries,userRoles})
}

const processRegister = async (req, res) => {
    
    const countries = await Country.findAll();
    const userRoles = await UserRol.findAll();

    const resultValidation=validationResult(req)
    // check if there are errors
    if(!resultValidation.isEmpty()){
                return res.render('users/register', {
                                                    errors: resultValidation.mapped(),  // los errores que contiene el objeto resultValidation
                                                    oldData: req.body                   // lo que ya el usuario habia ingresado
                                                 });
    }

    // if all validations are ok then check if the user already exists
    let userInDB = await Users.findOne({
        where: {'email': req.body.email}  // 'email' es el campo de la tabla 'users
    });

    
    if (userInDB) {
        return res.render('users/register', {
                        errors: {
                            email: {
                                msg: 'Este email ya está registrado'
                            }
                        },
                        oldData: req.body,
                        countries:countries,
                        userRoles:userRoles
     });
    }


    // if user is new then create the user in DB

    let hashedPassword = bcryptjs.hashSync(req.body.password, 10);
    let hashedConfirmPassword = bcryptjs.hashSync(req.body.confirmPassword, 10);
    let userToCreate={
        ...req.body,
        country_id: req.body.country,
        role_id: req.body.profile,
        avatar: req.file.filename,
        password: hashedPassword,
        confirmPassword: hashedConfirmPassword
    }

    try{
        let userCreated = await Users.create(userToCreate);
        return res.redirect('login')
    }
    catch(error){
        console.log(error)
    }


}

const login = (req, res) => {
    
    return res.render('users/login')
}

const loginProcess = async (req, res) => {

    let userToLogin = await Users.findOne({
        where: {'email': req.body.email},
        include : ['userCountry','userRole'] 
    });
   
   // ******************* check if user exists ************ 
    if (userToLogin) {
    // ****************** Check password *******************    
                let passwordOK=bcryptjs.compareSync(req.body.password, userToLogin.password)
                if (passwordOK) {
                    // elimino del objeto userToLogin la propiedad password
                    delete userToLogin.password;
                    delete userToLogin.confirmPassword;
                    // mantener el usuario logeado en session
                    req.session.userLogged = userToLogin;
                    // si el usuario eligió recordarme
                    if (req.body.rememberMe) {
                        res.cookie('userEmail', req.body.userEmail, {maxAge: (1000 * 60) * 2})
                    }
                    // redirigir a la pagina del usuario
                    res.redirect('/users/profile')
                } 

                return res.render('users/login', {
                    errors: {
                        userPassword: {
                            msg: 'Esta Contraseña es incorrecta'
                        }
                    },
                    oldData: req.body
                });      
    } else {
        return res.render('users/login', {
            errors: {
                userEmail: {
                    msg: 'Este email no está registrado'
                }
            },
            oldData: req.body
        });
    }
 }


const profile = (req, res) => {
    
    return res.render('users/usersProfile',{
        user: req.session.userLogged
    });
}

const logout = (req, res) => {
    res.clearCookie('userEmail');
    req.session.destroy();
    return res.redirect('/');

}

const carrito = (req, res) => {
    return res.render('users/carritoCompras')
}

const processCarrito = (req, res) => {
    return res.render('users/carritoCompras')
}


module.exports = {  
    register,
    processRegister,
    login,
    loginProcess,
    profile,
    logout,
    carrito,
    processCarrito,
  
}      