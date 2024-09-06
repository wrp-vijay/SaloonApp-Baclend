// const { BarberRating } = require('../models');
// const {
//     DATA_ISERT_SUCCESFULLY,
//     FAIELD_QUERY,
//     DATA_NOT_FOUND,
//     DATA_GET_SUCCESFULLY,
//     DATA_UPDATE } = require('../helper/message');

// exports.createBarberRating = async (req, res) => {
//     try {
//         const { barber_id, rating, user_id } = req.body;

//         const newBarberRating = await BarberRating.create({
//             barber_id,
//             rating,
//             user_id
//         });

//         res.status(200).json({ error: false, msg: DATA_ISERT_SUCCESFULLY, data: newBarberRating });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };

// exports.getBarberRatings = async (req, res) => {
//     try {
//         const barberRatings = await BarberRating.findAll();
//         if (!barberRatings) {
//             return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//         }
//         res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: barberRatings });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };

// exports.getBarberRatingById = async (req, res) => {
//     try {
//         const barberRating = await BarberRating.findByPk(req.params.id);
//         if (!barberRating) {
//             return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//         }
//         res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: barberRating });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };

// exports.updateBarberRating = async (req, res) => {
//     try {
//         const { barber_id, rating, user_id } = req.body;

//         const barberRating = await BarberRating.findByPk(req.params.id);
//         if (!barberRating) {
//             return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//         }

//         barberRating.barber_id = barber_id;
//         barberRating.rating = rating;
//         barberRating.user_id = user_id;

//         await barberRating.save();

//         res.status(200).json({ error: false, msg: DATA_UPDATE });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };

// exports.deleteBarberRating = async (req, res) => {
//     try {
//         const barberRating = await BarberRating.findByPk(req.params.id);
//         if (!barberRating) {
//             return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//         }

//         await barberRating.destroy();

//         res.status(200).json({ error: false, msg: DATA_UPDATE });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };


const { BarberRating, Barber, User } = require('../models');
const logger = require('../helper/logger'); // Adjust the path as needed
const {
    DATA_ISERT_SUCCESFULLY,
    FAIELD_QUERY,
    DATA_NOT_FOUND,
    DATA_GET_SUCCESFULLY,
    DATA_UPDATE
} = require('../helper/message');

exports.createBarberRating = async (req, res) => {
        const transaction = await BarberRating.sequelize.transaction();
        try {
            const { barber_id, rating, user_id } = req.body;

            const newBarberRating = await BarberRating.create({
                barber_id,
                rating,
                user_id
            }, { transaction });

            await transaction.commit();
            res.status(200).json({ error: false, msg: DATA_ISERT_SUCCESFULLY, data: newBarberRating });
        } catch (error) {
            await transaction.rollback();
            logger.error(error);
            res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
        }
    };

// exports.getBarberRatings = [
//     createBarberRatingLimiter,
//     async (req, res) => {
//         try {
//             const barberRatings = await BarberRating.findAll({
//                 include: [
//                     { model: Barber, as: 'barbers', attributes: ['first_name'] },
//                     { model: User, as: 'user', attributes: ['firstName'] }
//                 ]
//             });
//             if (!barberRatings) {
//                 return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//             }
//             res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: barberRatings });
//         } catch (error) {
//             logger.error(error);
//             res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//         }
//     }
// ];

exports.getBarberRatings = async (req, res) => {
    try {
        const barberRatings = await BarberRating.findAll();
        if (!barberRatings) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }
        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: barberRatings });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

// exports.getBarberRatingById = async (req, res) => {
//     try {
//         const barberRating = await BarberRating.findByPk(req.params.id, {
//             include: [
//                 { model: Barber, as: 'barbers', attributes: ['first_name'] }, // Include only first_name attribute
//                 { model: User, as: 'users', attributes: ['firstName'] } // Include only firstName attribute
//             ]
//         });
//         if (!barberRating) {
//             return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//         }
//         res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: barberRating });
//     } catch (error) {
//         logger.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };

exports.getBarberRatingById = async (req, res) => {
    try {
        const barberRating = await BarberRating.findByPk(req.params.id);
        if (!barberRating) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }
        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: barberRating });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

exports.updateBarberRating = async (req, res) => {
    const transaction = await BarberRating.sequelize.transaction();
    try {
        const { barber_id, rating, user_id } = req.body;

        const barberRating = await BarberRating.findByPk(req.params.id);
        if (!barberRating) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }

        barberRating.barber_id = barber_id;
        barberRating.rating = rating;
        barberRating.user_id = user_id;

        await barberRating.save({ transaction });

        await transaction.commit();
        res.status(200).json({ error: false, msg: DATA_UPDATE });
    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

exports.deleteBarberRating = async (req, res) => {
    const transaction = await BarberRating.sequelize.transaction();
    try {
        const barberRating = await BarberRating.findByPk(req.params.id);
        if (!barberRating) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }

        await barberRating.destroy({ transaction });

        await transaction.commit();
        res.status(200).json({ error: false, msg: DATA_UPDATE });
    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};
