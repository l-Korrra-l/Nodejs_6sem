const jwt = require('jsonwebtoken');
const config = {
    port: 3000,
    jwt: {
        tokens: {
            access: {
                type: 'access',
                expiresIn: '1m',
                secret: 'access-secret'
            },
            refresh: {
                type: 'refresh',
                expiresIn: '24h',
                secret: 'refresh-secret'
            }
        }
    }
};

const generateAccessToken = (id, login) => {
    const payload = {id, login, type: config.jwt.tokens.access.type},
        options = {expiresIn: config.jwt.tokens.access.expiresIn};

    return jwt.sign(payload, config.jwt.tokens.access.secret, options);
};

const generateRefreshToken = (id, login) => {
    const payload = {id, login, type: config.jwt.tokens.refresh.type},
        options = {expiresIn: config.jwt.tokens.refresh.expiresIn};

    return jwt.sign(payload, config.jwt.tokens.refresh.secret, options);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};
