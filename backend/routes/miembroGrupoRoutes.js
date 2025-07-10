const express = require('express');
const router = express.Router();
const MiembroGrupoController = require('../controllers/miembroGrupoController');

// Rutas para membresías
router.get('/', MiembroGrupoController.getAll);
router.get('/:id', MiembroGrupoController.getById);
router.post('/', MiembroGrupoController.create);
router.put('/:id', MiembroGrupoController.update);
router.delete('/:id', MiembroGrupoController.delete);

// Rutas adicionales para membresías
router.get('/usuario/:id_usuario', MiembroGrupoController.getByUsuario);
router.get('/grupo/:id_grupo', MiembroGrupoController.getByGrupo);
router.get('/verificar/:id_usuario/:id_grupo', MiembroGrupoController.checkMembership);

module.exports = router;