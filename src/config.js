module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV:process.env.NODE_ENV || 'development',
    DATABASE_URL:process.env.DATABASE_URL || 'postgresql://reytanubrata@localhost/Flp',
    SUPER_SECRET_PASS:process.env.SUPER_SECRET_PASS || "mySuperSecretPassForFREELANCEpro",
    EMAIL_PASS:process.env.EMAIL_PASS||"no pass",
    EMAIL_USER:process.env.EMAIL_USER||"no EMAIL"
}