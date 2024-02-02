require('dotenv').config({ path: 'var.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');

const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.use(routes);

server.listen(process.env.API_URL || 3000 , () => {
    console.log(`Server running on: Port ${process.env.PORT}`);
});
