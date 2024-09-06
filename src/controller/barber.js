// const { DATA_NOT_FOUND, DATA_ISERT_SUCCESFULLY, FAIELD_QUERY, DATA_GET_SUCCESFULLY, DATA_UPDATE, DATA_DELETE } = require('../helper/message');
// const { Barber } = require('../models');

// exports.createBarber = async (req, res) => {
//     try {
//         const { saloon_id, first_name, last_name, rating } = req.body;

//         const newBarber = await Barber.create({
//             saloon_id,
//             first_name,
//             last_name,
//             rating
//         });

//         res.status(200).json({ error: false, msg: DATA_ISERT_SUCCESFULLY, data: newBarber });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
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

// exports.getBarberById = async (req, res) => {
//     try {
//         const barber = await Barber.findByPk(req.params.id);
//         if (!barber) {
//             return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//         }
//         res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: barber });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };

// exports.updateBarber = async (req, res) => {
//     try {
//         const { saloon_id, first_name, last_name, rating } = req.body;

//         const barber = await Barber.findByPk(req.params.id);
//         if (!barber) {
//             return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//         }

//         barber.saloon_id = saloon_id;
//         barber.first_name = first_name;
//         barber.last_name = last_name;
//         barber.rating = rating;

//         await barber.save();

//         res.status(200).json({ error: false, msg: DATA_UPDATE });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };

// exports.deleteBarber = async (req, res) => {
//     try {
//         const barber = await Barber.findByPk(req.params.id);
//         if (!barber) {
//             return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
//         }

//         await barber.destroy();

//         res.status(200).json({ error: false, msg: DATA_DELETE });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
//     }
// };

const { Barber } = require('../models');
const logger = require('../helper/logger');
const rateLimit = require('express-rate-limit');
const { DATA_NOT_FOUND, DATA_ISERT_SUCCESFULLY, FAIELD_QUERY, DATA_GET_SUCCESFULLY, DATA_UPDATE, DATA_DELETE } = require('../helper/message');

const createBarberLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later."
});

exports.createBarber =[
    createBarberLimiter,
 async (req, res) => {
    const transaction = await Barber.sequelize.transaction();
    try {
        const { saloon_id, first_name, last_name, rating } = req.body;

        const newBarber = await Barber.create({
            saloon_id,
            first_name,
            last_name,
            rating
        }, { transaction });

        await transaction.commit();
        res.status(200).json({ error: false, msg: DATA_ISERT_SUCCESFULLY, data: newBarber });
    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
}
];
exports.getBarbers = async (req, res) => {
    try {
        const barbers = await Barber.findAll();
        if (!barbers || barbers.length === 0) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }
        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: barbers });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

exports.getBarberById = async (req, res) => {
    try {
        const barber = await Barber.findByPk(req.params.id);
        if (!barber) {
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }
        res.status(200).json({ error: false, msg: DATA_GET_SUCCESFULLY, data: barber });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

exports.updateBarber = async (req, res) => {
    const transaction = await Barber.sequelize.transaction();
    try {
        const { saloon_id, first_name, last_name, rating } = req.body;

        const barber = await Barber.findByPk(req.params.id, { transaction });
        if (!barber) {
            await transaction.rollback();
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }

        barber.saloon_id = saloon_id;
        barber.first_name = first_name;
        barber.last_name = last_name;
        barber.rating = rating;

        await barber.save({ transaction });
        await transaction.commit();

        res.status(200).json({ error: false, msg: DATA_UPDATE });

    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

exports.deleteBarber = async (req, res) => {
    const transaction = await Barber.sequelize.transaction();
    try {
        const barber = await Barber.findByPk(req.params.id, { transaction });
        if (!barber) {
            await transaction.rollback();
            return res.status(404).json({ error: true, msg: DATA_NOT_FOUND });
        }

        await barber.destroy({ transaction });
        await transaction.commit();

        res.status(200).json({ error: false, msg: DATA_DELETE });
    } catch (error) {
        await transaction.rollback();
        logger.error(error);
        res.status(500).json({ error: true, msg: FAIELD_QUERY, error: error.message });
    }
};

