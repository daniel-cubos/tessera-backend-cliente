require('dotenv').config();
const cors = require('cors');
const express = require('express');

const app = express();
const rotas = require('./routes');
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' })); app.use(cors());
app.use(rotas);

app.listen(process.env.PORT || 3000);
