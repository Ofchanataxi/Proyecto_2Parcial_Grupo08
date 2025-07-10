const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const grupoRoutes = require('./routes/grupoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const miembroGrupoRoutes = require('./routes/miembroGrupoRoutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/api/grupos', grupoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/miembroGrupo', miembroGrupoRoutes);

module.exports = app;