const jwt = require('jsonwebtoken');
const { User } = require('../models/users.model');

const checkToken = async (req, res, next) =>{
    if (!req.headers['authorization']){
        return res.status(401).json({ message: 'No hay token, haz login'});
    }

    const token = req.headers['authorization'];
    let data;
    try {
        data = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: 'El token no es correcto'});
    }

    const user = await User.findById(data.user_id);
    if (!user){
        return res.status(401).json({ message: 'El usuario no existe'});
    }

    req.user = user;

    next();
}

module.exports = {
    checkToken
}