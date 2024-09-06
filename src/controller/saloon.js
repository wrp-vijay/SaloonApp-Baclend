// const { REQUIRE_FIELD_MISSING, DATA_ISERT_SUCCESFULLY, FAIELD_QUERY, DATA_NOT_FOUND, DATA_GET_SUCCESFULLY, DATA_UPDATE, DATA_DELETE } = require('../helper/message');
// const { Saloon } = require('../models'); // Import the Saloon model

// // Create Saloon
// exports.createSaloon = async (req, res) => {
//     try {
//         const { owner_id, saloon_name, mobile_number, rating } = req.body;

//         const newSaloon = await Saloon.create({
//             owner_id,
//             saloon_name,
//             mobile_number,
//             rating
//         });

//         res.status(200).json({ error: false, msg: DATA_ISERT_SUCCESFULLY, data: newSaloon });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };

// // Read Saloons (Get all saloons)
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

// // Read Saloon by ID
// exports.getSaloonById = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const saloonInstance = await Saloon.findByPk(id);
//         if (!saloonInstance) {
//             return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//         }
//         res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: owners });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };

// // Update Saloon
// exports.updateSaloon = async (req, res) => {
//     try {
//         const saloonId = req.params.id;
//         const saloonInstance = await Saloon.findByPk(saloonId);

//         if (!saloonInstance) {
//             return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//         }

//         const updatedSaloon = {
//             owner_id: req.body.owner_id,
//             saloon_name: req.body.saloon_name,
//             mobile_number: req.body.mobile_number,
//             rating: req.body.rating
//         };

//         await Saloon.update(updatedSaloon, { where: { id: saloonId } });

//         res.status(200).json({ error: false, msg: DATA_UPDATE });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };

// // Delete Saloon
// exports.deleteSaloon = async (req, res) => {
//     try {
//         const saloonId = req.params.id;
//         const saloonInstance = await Saloon.findByPk(saloonId);

//         if (!saloonInstance) {
//             return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//         }

//         await Saloon.destroy({
//             where: {
//                 id: saloonId
//             }
//         });

//         res.status(200).json({ error: false, msg: DATA_DELETE });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };


const { Saloon, sequelize } = require('../models'); // Import the Saloon model and sequelize
const logger = require('../helper/logger'); // Adjust the path as needed
const { DATA_ISERT_SUCCESFULLY, FAIELD_QUERY, DATA_NOT_FOUND, DATA_GET_SUCCESFULLY, DATA_UPDATE, DATA_DELETE } = require('../helper/message');

// Create Saloon
exports.createSaloon = async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            const { owner_id, saloon_name, mobile_number, rating } = req.body;

            const newSaloon = await Saloon.create({
                owner_id,
                saloon_name,
                mobile_number,
                rating
            }, { transaction });

            await transaction.commit();
            res.status(200).json({ error: false, msg: DATA_ISERT_SUCCESFULLY, data: newSaloon });
        } catch (error) {
            await transaction.rollback();
            logger.error(error);
            res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
        }
    };

// Read Saloons (Get all saloons)
exports.getAllSaloons = async (req, res) => {
        try {
            const saloons = await Saloon.findAll();
            if (!saloons) {
                return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
            }
            res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: saloons });
        } catch (error) {
            logger.error(error);
            res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
        }
    };

// Read Saloon by ID
exports.getSaloonById = async (req, res) => {
        const { id } = req.params;
        try {
            const saloonInstance = await Saloon.findByPk(id);
            if (!saloonInstance) {
                return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
            }
            res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: saloonInstance });
        } catch (error) {
            logger.error(error);
            res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
        }
    };

// Update Saloon
exports.updateSaloon = async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            const saloonId = req.params.id;
            const saloonInstance = await Saloon.findByPk(saloonId);

            if (!saloonInstance) {
                return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
            }

            const updatedSaloon = {
                owner_id: req.body.owner_id,
                saloon_name: req.body.saloon_name,
                mobile_number: req.body.mobile_number,
                rating: req.body.rating
            };

            await Saloon.update(updatedSaloon, { where: { id: saloonId }, transaction });

            await transaction.commit();
            res.status(200).json({ error: false, msg: DATA_UPDATE });
        } catch (error) {
            await transaction.rollback();
            logger.error(error);
            res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
        }
    };

// Delete Saloon
exports.deleteSaloon = async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            const saloonId = req.params.id;
            const saloonInstance = await Saloon.findByPk(saloonId);

            if (!saloonInstance) {
                return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
            }

            await Saloon.destroy({ where: { id: saloonId }, transaction });

            await transaction.commit();
            res.status(200).json({ error: false, msg: DATA_DELETE });
        } catch (error) {
            await transaction.rollback();
            logger.error(error);
            res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
        }
    };