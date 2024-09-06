const bcrypt = require('bcrypt');
const { User, sequelize } = require('../models'); // Import the User model and sequelize
const logger = require('../helper/logger'); // Adjust the path as needed
const {
    ALRADY_REGISTER,
    DATA_ISERT_SUCCESFULLY,
    FAIELD_QUERY,
    DATA_GET_SUCCESFULLY,
    DATA_NOT_FOUND,
    DATA_UPDATE,
    DATA_DELETE,
} = require('../helper/message');

// Create User
exports.createUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { firstName, lastName, email, password, mobile_number, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ error: true, msg: `${email} ${ALRADY_REGISTER}` });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
            mobile_number,
            role
        }, { transaction });

        await transaction.commit();
        res.status(200).json({ error: false, msg: DATA_ISERT_SUCCESFULLY, data: newUser });
    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

// Read Users (Get all users)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        if (!users) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }
        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: users });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

// Read User by ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }
        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: user });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const userId = req.params.id;
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }

        const updatedUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobile_number: req.body.mobile_number,
            role: req.body.role
        };

        await User.update(updatedUser, { where: { id: userId }, transaction });

        await transaction.commit();
        res.status(200).json({ error: false, msg: DATA_UPDATE });
    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }

        await User.destroy({ where: { id: req.params.id }, transaction });

        await transaction.commit();
        res.status(200).json({ error: false, msg: DATA_DELETE });
    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};
