import joi from "joi";

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
        .min(6)
        .max(20).required()
});
export const registerSchema = loginSchema.keys({
    firstname: joi.string().min(3).max(30).required(),
    lastname: joi.string().min(3).max(30).required(),
    phoneNumber: joi.string().pattern(/^(002|\+2)?01[0125][0-9]{8}$/),
    confirmPassword: joi.string().valid(joi.ref('password')).required(),
    gender: joi.string().valid('male', 'female', 'other').default('other'),
    age: joi.number().integer().min(16).max(60),

});