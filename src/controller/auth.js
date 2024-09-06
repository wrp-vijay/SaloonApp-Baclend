// const bcrypt = require('bcrypt');
// const { User } = require('../models'); // Import the User model
// const { Barber } = require('../models');
// const { Saloon } = require('../models'); // Import the Saloon model
// const { signAccessToken } = require('../middleware/jwtAuth');
// const { REQUIRE_FIELD_MISSING, ALRADY_REGISTER, REGISTER_SUCCESSFUL, FAIELD_QUERY, BAD_REQUEST, NOT_REGISTERED, INVALID_DETAILS, LOGIN_SUCCESSFUL, DATA_NOT_FOUND, DATA_GET_SUCCESFULLY } = require('../helper/message');

// exports.registerUser = async (req, res) => {
//     try {
//         const { firstName, lastName, email, password, mobile_number, role } = req.body;

//         const existingUser = await User.findOne({ where: { email } });

//         if (existingUser) {
//             return res.json({ status: true, msg: `${email} ${ALRADY_REGISTER}` });
//         }

//         const hashPassword = await bcrypt.hash(password, 10);

//         const newUser = await User.create({
//             firstName: firstName,
//             lastName: lastName,
//             email: email,
//             password: hashPassword,
//             mobile_number: mobile_number,
//             role: role
//         });

//         res.status(200).json({ error: false, msg: REGISTER_SUCCESSFUL });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };



// exports.login = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;

//         const user = await User.findOne({ where: { email } }); // Exclude soft-deleted users
//         if (!user) {
//             return res.status(404).json({ error: true, msg: NOT_REGISTERED });
//         }

//         const isValidPassword = await bcrypt.compare(password, user.password);
//         if (!isValidPassword) {
//             return res.status(401).json({ error: true, msg: INVALID_DETAILS });
//         }

//         const accessToken = await signAccessToken(user.id);

//         res.status(200).json({ status: true, msg: LOGIN_SUCCESSFUL, accessToken });
//     } catch (error) {
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//         next(error);
//     }
// };

// exports.getBarbers = async (req, res) => {
//     try {
//         const barbers = await Barber.findAll();
//         if (!barbers) {
//             return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//         }
//         res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: barbers });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };

// exports.getAllSaloons = async (req, res) => {
//     try {
//         const saloons = await Saloon.findAll();
//         if (!saloons) {
//             return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//         }
//         res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: saloons });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };

const bcrypt = require('bcrypt');
const { User, Barber, Saloon } = require('../models'); // Import models
const { signAccessToken, generateCaptcha } = require('../middleware/jwtAuth');

const {
    ALRADY_REGISTER, 
    REGISTER_SUCCESSFUL, 
    FAIELD_QUERY, NOT_REGISTERED, 
    INVALID_DETAILS, 
    LOGIN_SUCCESSFUL, 
    DATA_NOT_FOUND, 
    DATA_GET_SUCCESFULLY
} = require('../helper/message');

exports.registerUser = async (req, res) => {
    const transaction = await User.sequelize.transaction();
    try {
        const { firstName, lastName, email, password, mobile_number, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            await transaction.rollback();
            return res.json({ status: true, msg: `${email} ${ALRADY_REGISTER}` });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
            mobile_number,
            role
        }, { transaction });

        await transaction.commit();
        res.status(200).json({ error: false, msg: REGISTER_SUCCESSFUL });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: true, msg: NOT_REGISTERED });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: true, msg: INVALID_DETAILS });
        }

        const accessToken = await signAccessToken(user.id);

        res.status(200).json({ status: true, msg: LOGIN_SUCCESSFUL, accessToken });
    } catch (error) {
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
        next(error);
    }
};

exports.getBarbers = async (req, res) => {
    try {
        const barbers = await Barber.findAll();
        if (!barbers) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }
        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: barbers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

exports.getAllSaloons = async (req, res) => {
    try {
        const saloons = await Saloon.findAll();
        if (!saloons) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }
        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: saloons });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

