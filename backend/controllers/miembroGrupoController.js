const MiembroGrupo = require('../models/MiembroGrupo');

exports.getAll = async (req, res) => {
    try {
        const miembrosGrupo = await MiembroGrupo.getAll();
        res.status(200).json(miembrosGrupo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const miembroGrupo = await MiembroGrupo.getById(req.params.id);
        if (!miembroGrupo) {
            return res.status(404).json({ error: 'Membresía no encontrada' });
        }
        res.status(200).json(miembroGrupo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        // Verificar si ya existe la membresía
        const existe = await MiembroGrupo.exists(req.body.id_usuario, req.body.id_grupo);
        if (existe) {
            return res.status(400).json({ error: 'El usuario ya es miembro de este grupo' });
        }
        
        const miembroGrupo = await MiembroGrupo.create(req.body);
        res.status(201).json(miembroGrupo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const miembroGrupo = await MiembroGrupo.update(req.params.id, req.body);
        if (!miembroGrupo) {
            return res.status(404).json({ error: 'Membresía no encontrada' });
        }
        res.status(200).json(miembroGrupo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const miembroGrupo = await MiembroGrupo.delete(req.params.id);
        if (!miembroGrupo) {
            return res.status(404).json({ error: 'Membresía no encontrada' });
        }
        res.status(200).json({ message: 'Membresía eliminada', miembroGrupo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getByUsuario = async (req, res) => {
    try {
        const membresias = await MiembroGrupo.getByUsuario(req.params.id_usuario);
        res.status(200).json(membresias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getByGrupo = async (req, res) => {
    try {
        const membresias = await MiembroGrupo.getByGrupo(req.params.id_grupo);
        res.status(200).json(membresias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.checkMembership = async (req, res) => {
    try {
        const existe = await MiembroGrupo.exists(req.params.id_usuario, req.params.id_grupo);
        res.status(200).json({ existe });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};