// const bcrypt = require('bcrypt');
// const { Owner } = require('../models'); // Import the Owner model
// const { ALRADY_REGISTER, DATA_ISERT_SUCCESFULLY, FAIELD_QUERY, DATA_GET_SUCCESFULLY, DATA_NOT_FOUND, DATA_UPDATE, DATA_DELETE, BAD_REQUEST, NOT_REGISTERED, INVALID_DETAILS, LOGIN_SUCCESSFUL } = require('../helper/message');
// const { signAccessToken } = require('../middleware/jwtAuth');

// exports.createOwner = async (req, res) => {
//     try {
//         const { firstName, lastName, email, password, mobile_number, role } = req.body;

//         const existingOwner = await Owner.findOne({ where: { email } });

//         if (existingOwner) {
//             return res.status(400).json({ error: true, msg: `${email} ${ALRADY_REGISTER}` });
//         }

//         const hashPassword = await bcrypt.hash(password, 10);

//         const newOwner = await Owner.create({
//             firstName,
//             lastName,
//             email,
//             password: hashPassword,
//             mobile_number,
//             role
//         });

//         res.status(200).json({ error: false, msg: DATA_ISERT_SUCCESFULLY, data: newOwner });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };


// exports.ownerLogin = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ error: true, msg: BAD_REQUEST });
//         }

//         const user = await Owner.findOne({ where: { email } });

//         if (!user) {
//             return res.status(404).json({ error: true, msg: NOT_REGISTERED });
//         }

//         const isValidPassword = await bcrypt.compare(password, user.password);
//         if (!isValidPassword) {
//             return res.status(401).json({ error: true, msg: INVALID_DETAILS });
//         }

//         const accessToken = await signAccessToken({ id: user.id, owner_id: user.id });

//         res.status(200).json({ status: true, msg: LOGIN_SUCCESSFUL, accessToken });
//     } catch (error) {
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//         next(error);
//     }
// };
// // Read Owners (Get all owners)
// exports.getAllOwners = async (req, res) => {
//     try {
//         const owners = await Owner.findAll();
//         if (!owners) {
//             return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//         }
//         res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: owners });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };

// // Read Owner by ID
// exports.getOwnerById = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const owners = await Owner.findByPk(id);
//         if (!owners) {
//             return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//         }
//         res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: owners });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };

// // Update Owner
// exports.updateOwner = async (req, res) => {
//     try {
//         const ownerId = req.params.id;
//         const owners = await Owner.findOne({ where: { id: ownerId } });

//         if (!owners) {
//             return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//         }

//         const updatedOwner = {
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             email: req.body.email,
//             mobile_number: req.body.mobile_number,
//             role: req.body.role
//         };

//         await Owner.update(updatedOwner, { where: { id: ownerId } });

//         res.status(200).json({ error: false, msg: DATA_UPDATE });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };

// // Delete Owner
// exports.deleteOwner = async (req, res) => {
//     try {
//         const ownerId = req.params.id;
//         const owners = await Owner.findByPk(ownerId);

//         if (!owners) {
//             return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//         }

//         await Owner.destroy({
//             where: {
//                 id: req.params.id
//             }
//         });

//         res.status(200).json({ error: false, msg: DATA_DELETE });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };


const bcrypt = require('bcrypt');
const { Owner, sequelize } = require('../models'); // Import the Owner model and sequelize
const logger = require('../helper/logger'); // Adjust the path as needed
const {
    ALRADY_REGISTER,
    DATA_ISERT_SUCCESFULLY,
    FAIELD_QUERY,
    DATA_GET_SUCCESFULLY,
    DATA_NOT_FOUND,
    DATA_UPDATE,
    DATA_DELETE,
    BAD_REQUEST,
    NOT_REGISTERED,
    INVALID_DETAILS,
    LOGIN_SUCCESSFUL
} = require('../helper/message');
const { signAccessToken } = require('../middleware/jwtAuth');


exports.createOwner = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { firstName, lastName, email, password, mobile_number, role } = req.body;

        const existingOwner = await Owner.findOne({ where: { email } });

        if (existingOwner) {
            return res.status(400).json({ error: true, msg: `${email} ${ALRADY_REGISTER}` });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newOwner = await Owner.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
            mobile_number,
            role
        }, { transaction });

        await transaction.commit();
        res.status(200).json({ error: false, msg: DATA_ISERT_SUCCESFULLY, data: newOwner });
    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

exports.ownerLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: true, msg: BAD_REQUEST });
        }

        const user = await Owner.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: true, msg: NOT_REGISTERED });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: true, msg: INVALID_DETAILS });
        }

        const accessToken = await signAccessToken({ id: user.id, owner_id: user.id });

        res.status(200).json({ status: true, msg: LOGIN_SUCCESSFUL, accessToken });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
        next(error);
    }
};

exports.getAllOwners = async (req, res) => {
    try {
        const owners = await Owner.findAll();
        if (!owners) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }
        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: owners });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};


// exports.getAllOwners = async (req, res) => {
//     try {
//         const owners = await Owner.findAll();
//         if (!owners) {
//             return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//         }
//         res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: owners });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };

// Read Owner by ID
exports.getOwnerById = async (req, res) => {
    const { id } = req.params;
    try {
        const owners = await Owner.findByPk(id);
        if (!owners) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }
        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: owners });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

// Update Owner
exports.updateOwner = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const ownerId = req.params.id;
        const owners = await Owner.findOne({ where: { id: ownerId } });

        if (!owners) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }

        const updatedOwner = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobile_number: req.body.mobile_number,
            role: req.body.role
        };

        await Owner.update(updatedOwner, { where: { id: ownerId }, transaction });

        await transaction.commit();
        res.status(200).json({ error: false, msg: DATA_UPDATE });
    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

// Delete Owner
exports.deleteOwner = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const ownerId = req.params.id;
        const owners = await Owner.findByPk(ownerId);

        if (!owners) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }

        await Owner.destroy({ where: { id: req.params.id }, transaction });

        await transaction.commit();
        res.status(200).json({ error: false, msg: DATA_DELETE });
    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};
