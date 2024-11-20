const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/users.model');

const register = async (req, res, next) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 8);
        const user = await User.create(req.body);
        res.json(user);
    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    // BODY: email, password
    const { email, password } = req.body;
    // ¿Existe el email en la BD?
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(403).json({ message: 'Error en email y/o contraseña' });
    }

    // ¿Coinciden las password?
    const same = await bcrypt.compare(password, user.password);
    if (!same) {
        return res.status(403).json({ message: 'Error en email y/o contraseña' });
    }

    res.json({
        message: 'Login correcto',
        token: jwt.sign({
            user_id: user._id,
            user_role: user.role
        }, process.env.SECRET_KEY, { expiresIn: '5 hours' })
    });

}

const addProductCart = async (req, res, next) => {
    try {
        const { product_id } = req.body;
        if (!req.user.cart.includes(product_id)) {
            req.user.cart.push(product_id);
            await req.user.save();
        }
        res.json(req.user);
    } catch (error) {
        next(error);
    }
}

const profile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('cart', '-_id name price');
        res.json(user);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register, login, addProductCart, profile
}