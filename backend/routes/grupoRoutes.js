const express = require('express');
const router = express.Router();
const GrupoController = require('../controllers/grupoController');

// Rutas para grupos
router.get('/', GrupoController.getAll);
router.get('/:id', GrupoController.getById);
router.post('/', GrupoController.create);
router.put('/:id', GrupoController.update);
router.delete('/:id', GrupoController.delete);

// Rutas adicionales para grupos
router.get('/:id/miembros', GrupoController.getMiembros);
router.get('/:id/estadisticas', GrupoController.getEstadisticas);

module.exports = router;
