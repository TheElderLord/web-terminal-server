const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    NOMAD_HOST : process.env.NOMAD_HOST,
    TERMINAL_PORT: process.env.TERMINAL_PORT,
    APP_PORT: process.env.APP_PORT,
}
