module.exports = {
    port: 8080,
    enviornment: process.env.NODE_ENV,
    production: process.env.NODE_ENV === 'production',
    secretTokenKey: process.env.SECRET_KEY
}