const Joi = require('joi');

const registerSchema = Joi.object({
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    mobile_number: Joi.string().pattern(/^[0-9]+$/).required(), // Expecting mobile_number as string of digits
    role: Joi.string().valid('user', 'User').required() // Adding 'User' to the allowed roles
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const ownerSchema = Joi.object({
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    mobile_number: Joi.string().pattern(/^[0-9]+$/).required(), // Expecting mobile_number as string of digits
    role: Joi.string().valid('owner', 'Owner').required() // Adding 'User' to the allowed roles
});

const saloonSchema = Joi.object({
    owner_id: Joi.number().integer().required(),
    saloon_name: Joi.string().min(3).max(50).required(),
    mobile_number: Joi.string().pattern(/^[0-9]+$/).required(),
    rating: Joi.number().integer().min(0).max(5),
});

const saloonRattingSchema = Joi.object({
    saloon_id: Joi.number().integer().required(),
    user_id: Joi.number().integer().required(),
    rating: Joi.number().integer().min(0).max(5),
});

const barberSchema = Joi.object({
    saloon_id: Joi.number().integer().required(),
    first_name: Joi.string().min(3).max(30).required(),
    last_name: Joi.string().min(3).max(30).required(),
    rating: Joi.number().integer().min(0).max(5),
});

const barberRattingSchema = Joi.object({
    barber_id: Joi.number().integer().required(),
    rating: Joi.number().integer().min(0).max(5),
    user_id: Joi.number().integer().required(),
});

module.exports = {
    registerSchema,
    loginSchema,
    ownerSchema,
    saloonSchema,
    saloonRattingSchema,
    barberSchema,
    barberRattingSchema
};
