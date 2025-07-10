const Grupo = require('../models/Grupo');

exports.getAll = async (req, res) => {
    try {
        const grupos = await Grupo.getAll();
        res.status(200).json(grupos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const grupo = await Grupo.getById(req.params.id);
        if (!grupo) {
            return res.status(404).json({ error: 'Grupo no encontrado' });
        }
        res.status(200).json(grupo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const grupo = await Grupo.create(req.body);
        res.status(201).json(grupo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const grupo = await Grupo.update(req.params.id, req.body);
        if (!grupo) {
            return res.status(404).json({ error: 'Grupo no encontrado' });
        }
        res.status(200).json(grupo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const grupo = await Grupo.delete(req.params.id);
        if (!grupo) {
            return res.status(404).json({ error: 'Grupo no encontrado' });
        }
        res.status(200).json({ message: 'Grupo eliminado', grupo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMiembros = async (req, res) => {
    try {
        const miembros = await Grupo.getMiembros(req.params.id);
        res.status(200).json(miembros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEstadisticas = async (req, res) => {
    try {
        const estadisticas = await Grupo.getEstadisticas(req.params.id);
        res.status(200).json(estadisticas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};