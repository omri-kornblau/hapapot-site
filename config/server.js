module.exports = {
    port: 8080,
    enviornment: process.env.NODE_ENV,
    production: process.env.NODE_ENV === "production",
    secretTokenKey: process.env.SECRET_KEY,
    registrationCode: process.env.REGIS_CODE,
    maxUserLogins: 10
}