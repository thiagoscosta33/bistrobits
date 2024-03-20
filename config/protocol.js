const fs = require('fs');

let options;

if (process.env.NODE_ENV === 'production') {
    options = {
        key: fs.readFileSync(process.env.SSL_KEY_PATH),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH),
        ca: fs.readFileSync(process.env.SSL_CA_PATH)
    };
} else {
    options = {
        key: fs.readFileSync('./certs/cert.key'),
        cert: fs.readFileSync('./certs/cert.crt'),
        ca: fs.readFileSync('./certs/ca.crt')
    };
}

module.exports = options;
