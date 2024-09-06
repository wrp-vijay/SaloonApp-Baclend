// const { Saloonratting } = require('../models'); // Import the saloonRattings model

// exports.createSaloonRating = async (req, res) => {
//     try {
//         const { saloon_id, user_id, rating } = req.body;

//         const newSaloonRating = await Saloonratting.create({
//             saloon_id,
//             user_id,
//             rating
//         });

//         res.status(200).json({
//             status: true,
//             message: "Saloon rating created successfully",
//             data: newSaloonRating
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             status: false,
//             message: "Failed to create saloon rating",
//             error: error.message
//         });
//     }
// };


// // Read SaloonRatings (Get all saloon ratings)
// exports.getAllSaloonRatings = async (req, res) => {
//     try {
//         const saloonRatings = await Saloonratting.findAll();
//         res.status(200).json({
//             status: true,
//             data: saloonRatings
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             status: false,
//             message: "Failed to fetch saloon ratings",
//             error: error.message
//         });
//     }
// };

// // Read SaloonRating by ID
// exports.getSaloonRatingById = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const saloonRating = await Saloonratting.findByPk(id);
//         if (!saloonRating) {
//             return res.status(404).json({
//                 status: false,
//                 message: "Saloon rating not found"
//             });
//         }
//         res.status(200).json({
//             status: true,
//             data: saloonRating
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             status: false,
//             message: "Failed to fetch saloon rating",
//             error: error.message
//         });
//     }
// };

// // Update SaloonRating
// exports.updateSaloonRating = async (req, res) => {
//     try {
//         const saloonRatingId = req.params.id;
//         const saloonRating = await Saloonratting.findByPk(saloonRatingId);

//         if (!saloonRating) {
//             return res.status(404).json({
//                 status: false,
//                 message: "Saloon rating not found"
//             });
//         }

//         const updatedSaloonRating = {
//             saloon_id: req.body.saloon_id,
//             user_id: req.body.user_id,
//             rating: req.body.rating
//         };

//         await Saloonratting.update(updatedSaloonRating, { where: { id: saloonRatingId } });

//         res.status(200).json({
//             status: true,
//             message: "Saloon rating updated successfully"
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             status: false,
//             message: "Failed to update saloon rating",
//             error: error.message
//         });
//     }
// };

// // Delete SaloonRating
// exports.deleteSaloonRating = async (req, res) => {
//     try {
//         const saloonRatingId = req.params.id;
//         const saloonRating = await Saloonratting.findByPk(saloonRatingId);

//         if (!saloonRating) {
//             return res.status(404).json({
//                 status: false,
//                 message: "Saloon rating not found"
//             });
//         }

//         await Saloonratting.destroy();

//         res.status(200).json({
//             status: true,
//             message: "Saloon rating deleted successfully"
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             status: false,
//             message: "Failed to delete saloon rating",
//             error: error.message
//         });
//     }
// };


const { Saloonratting, Saloon, User, sequelize } = require('../models'); // Import the Saloonratting model and sequelize
const logger = require('../helper/logger'); // Adjust the path as needed
const { DATA_ISERT_SUCCESFULLY, FAIELD_QUERY, DATA_NOT_FOUND, DATA_DELETE, DATA_UPDATE, DATA_GET_SUCCESFULLY } = require('../helper/message');

// Create SaloonRating
exports.createSaloonRating = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { saloon_id, user_id, rating } = req.body;
        const newSaloonRating = await Saloonratting.create({
            saloon_id,
            user_id,
            rating
        }, { transaction });

        await transaction.commit();
        res.status(200).json({ error: false, msg: DATA_ISERT_SUCCESFULLY, data: newSaloonRating });

    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

// Read SaloonRatings (Get all saloon ratings)
exports.getAllSaloonRatings = async (req, res) => {
    try {
        const saloonRatings = await Saloonratting.findAll();
        if (!saloonRatings) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }
        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: saloonRatings });

    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

// Read SaloonRating by ID
exports.getSaloonRatingById = async (req, res) => {
    const { id } = req.params;
    try {
        const saloonRating = await Saloonratting.findByPk(id);
        if (!saloonRating) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }
        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: saloonRating });

    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

// exports.getAllSaloonRatings = async (req, res) => {
//         try {
//             const saloonRatings = await Saloonratting.findAll({
//                 include: [
//                     {
//                         model: Saloon,
//                         as: 'saloons', // Use the correct alias defined in the association
//                         attributes: ['saloon_name']
//                     },
//                     {
//                         model: User,
//                         as: 'users', // Use the correct alias defined in the association
//                         attributes: ['firstName', 'lastName']
//                     }
//                 ]
//             });
//             if (!saloonRatings) {
//                 return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//             }
//             res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: saloonRatings });

//         } catch (error) {
//             logger.error(error);
//             res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//         }
//     };

// Update SaloonRating

exports.updateSaloonRating = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const saloonRatingId = req.params.id;
        const saloonRating = await Saloonratting.findByPk(saloonRatingId);

        if (!saloonRating) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }

        const updatedSaloonRating = {
            saloon_id: req.body.saloon_id,
            user_id: req.body.user_id,
            rating: req.body.rating
        };

        await Saloonratting.update(updatedSaloonRating, { where: { id: saloonRatingId }, transaction });

        await transaction.commit();
        res.status(200).json({ error: false, msg: DATA_UPDATE });
    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};


// Delete SaloonRating
exports.deleteSaloonRating = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const saloonRatingId = req.params.id;
        const saloonRating = await Saloonratting.findByPk(saloonRatingId);

        if (!saloonRating) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }

        await Saloonratting.destroy({ where: { id: saloonRatingId }, transaction });

        await transaction.commit();
        res.status(200).json({ error: false, msg: DATA_DELETE });
    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};
