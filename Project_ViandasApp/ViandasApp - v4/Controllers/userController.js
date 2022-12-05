
const path = require('path');

const User = require('../models/User');

const {validationResult} = require('express-validator');
const { userInfo } = require('os');
const bcryptjs = require('bcryptjs');

//const renderHome = (req, res) => {
 //   return res.render('home')
//}

//const renderAbout = (req, res) => {
  //  return res.render('about')
//}

const register = (req, res) => {
    
    return res.render('users/register')
}

const processRegister = (req, res) => {
    const resultValidation=validationResult(req)
    // check if there are errors
    if(!resultValidation.isEmpty()){
                return res.render('users/register', {
                                                    errors: resultValidation.mapped(),  // los errores que contiene el objeto resultValidation
                                                    oldData: req.body                   // lo que ya el usuario habia ingresado
                                                 });
    }

    // if all validations are ok then check if the user already exists
    let userInDB = User.findByField('email', req.body.email);

    if (userInDB) {
        return res.render('users/register', {
                        errors: {
                            email: {
                                msg: 'Este email ya está registrado'
                            }
                        },
                        oldData: req.body
     });
    }


    // if user is new then create the user in DB

    let hashedPassword = bcryptjs.hashSync(req.body.password, 10);
    let hashedConfirmPassword = bcryptjs.hashSync(req.body.confirmPassword, 10);
    let userToCreate={
        ...req.body,
        avatar: req.file.filename,
        password: hashedPassword,
        confirmPassword: hashedConfirmPassword

    }

    User.create(userToCreate);
    return res.redirect('login')


}

const login = (req, res) => {
    
    return res.render('users/login')
}

const loginProcess = (req, res) => {
    
    let userToLogin = User.findByField('email', req.body.userEmail);
   // ******************* check if user exists ************ 
    if (userToLogin) {
    // ****************** Check password *******************    
                let passwordOK=bcryptjs.compareSync(req.body.userPassword, userToLogin.password)
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