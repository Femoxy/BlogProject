const hapiJoiValidator = require("@hapi/joi");
const validateBlog = (data) => {
    const validateUser = hapiJoiValidator.object({
        Username: hapiJoiValidator.string().required(),
        email: hapiJoiValidator.string().required(),
        password: hapiJoiValidator.string().required().min(6),
        
    });
    return validateUser.validate(data);
};


const validateLogin = (data) => {
    const validateUser = hapiJoiValidator.object({
        
        email: hapiJoiValidator.string().required(),
        password: hapiJoiValidator.string().required().min(6),
        
    });
    return validateUser.validate(data);
};



module.exports = {validateBlog, validateLogin};