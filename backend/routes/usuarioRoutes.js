const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

router.get('/', UsuarioController.getAll);
router.get('/:id', UsuarioController.getById);
router.post('/', UsuarioController.create);
router.put('/:id', UsuarioController.update);
router.delete('/:id', UsuarioController.delete);

// Rutas adicionales para usuarios
router.get('/:id/grupos', UsuarioController.getGrupos);

module.exports = router;