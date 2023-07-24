const appCode = require('./app-code.js');

class AppError extends Error {
    constructor(message, code = appCode.LOGIC) {
        super(message);  
        this.name = 'AppError';  
        this.code = code;
    }
}

module.exports = AppError;