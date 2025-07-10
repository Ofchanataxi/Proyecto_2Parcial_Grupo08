const pool = require('../config/db');

class MiembroGrupo {
    constructor(id_miembro, id_usuario, id_grupo, fecha_union, rol, activo) {
        this.id_miembro = id_miembro;
        this.id_usuario = id_usuario;
        this.id_grupo = id_grupo;
        this.fecha_union = fecha_union;
        this.rol = rol;
        this.activo = activo;
    }

    static async getAll() {
        const result = await pool.query(`
            SELECT mg.*, u.nombre AS nombre_usuario, u.correo, g.nombre_grupo 
            FROM miembros_grupo mg
            INNER JOIN usuarios u ON mg.id_usuario = u.id_usuario
            INNER JOIN grupos g ON mg.id_grupo = g.id_grupo
            WHERE mg.activo = TRUE AND u.activo = TRUE AND g.activo = TRUE
            ORDER BY mg.id_miembro
        `);
        return result.rows.map(row => ({
            id_miembro: row.id_miembro,
            id_usuario: row.id_usuario,
            id_grupo: row.id_grupo,
            fecha_union: row.fecha_union,
            rol: row.rol,
            nombre_usuario: row.nombre_usuario,
            correo: row.correo,
            nombre_grupo: row.nombre_grupo
        }));
    }

    static async getById(id_miembro) {
        const result = await pool.query(`
            SELECT mg.*, u.nombre as nombre_usuario, u.correo, g.nombre_grupo 
            FROM miembros_grupo mg
            INNER JOIN usuarios u ON mg.id_usuario = u.id_usuario
            INNER JOIN grupos g ON mg.id_grupo = g.id_grupo
            WHERE mg.id_miembro = $1 AND mg.activo = TRUE
        `, [id_miembro]);
        if (result.rows.length > 0) {
            const row = result.rows[0];
            return {
                id_miembro: row.id_miembro,
                id_usuario: row.id_usuario,
                id_grupo: row.id_grupo,
                fecha_union: row.fecha_union,
                rol: row.rol,
                nombre_usuario: row.nombre_usuario,
                correo: row.correo,
                nombre_grupo: row.nombre_grupo
            };
        } else {
            throw new Error('Membresía no encontrada');
        }
    }

    static async create(miembro) {
        const result = await pool.query(
            'INSERT INTO miembros_grupo (id_usuario, id_grupo, fecha_union, rol) VALUES ($1, $2, $3, $4) RETURNING *',
            [miembro.id_usuario, miembro.id_grupo, miembro.fecha_union || new Date(), miembro.rol || 'miembro']
        );
        return new MiembroGrupo(
            result.rows[0].id_miembro,
            result.rows[0].id_usuario,
            result.rows[0].id_grupo,
            result.rows[0].fecha_union,
            result.rows[0].rol,
            result.rows[0].activo
        );
    }

    static async update(id_miembro, miembro) {
        const result = await pool.query(
            'UPDATE miembros_grupo SET id_usuario = $1, id_grupo = $2, fecha_union = $3, rol = $4, updated_at = CURRENT_TIMESTAMP WHERE id_miembro = $5 AND activo = TRUE RETURNING *',
            [miembro.id_usuario, miembro.id_grupo, miembro.fecha_union, miembro.rol, id_miembro]
        );
        if (result.rows.length > 0) {
            return new MiembroGrupo(
                result.rows[0].id_miembro,
                result.rows[0].id_usuario,
                result.rows[0].id_grupo,
                result.rows[0].fecha_union,
                result.rows[0].rol,
                result.rows[0].activo
            );
        } else {
            throw new Error('Membresía no encontrada');
        }
    }

    static async delete(id_miembro) {
        const result = await pool.query('UPDATE miembros_grupo SET activo = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id_miembro = $1 RETURNING *', [id_miembro]);
        if (result.rows.length > 0) {
            return new MiembroGrupo(
                result.rows[0].id_miembro,
                result.rows[0].id_usuario,
                result.rows[0].id_grupo,
                result.rows[0].fecha_union,
                result.rows[0].rol,
                result.rows[0].activo
            );
        } else {
            throw new Error('Membresía no encontrada');
        }
    }

    // Obtener membresías por usuario
    static async getByUsuario(id_usuario) {
        const result = await pool.query(`
            SELECT mg.*, g.nombre_grupo, g.descripcion 
            FROM miembros_grupo mg
            INNER JOIN grupos g ON mg.id_grupo = g.id_grupo
            WHERE mg.id_usuario = $1 AND mg.activo = TRUE AND g.activo = TRUE
            ORDER BY g.nombre_grupo
        `, [id_usuario]);
        return result.rows.map(row => ({
            id_miembro: row.id_miembro,
            id_usuario: row.id_usuario,
            id_grupo: row.id_grupo,
            fecha_union: row.fecha_union,
            rol: row.rol,
            nombre_grupo: row.nombre_grupo,
            descripcion: row.descripcion
        }));
    }

    // Obtener membresías por grupo
    static async getByGrupo(id_grupo) {
        const result = await pool.query(`
            SELECT mg.*, u.nombre as nombre_usuario, u.correo 
            FROM miembros_grupo mg
            INNER JOIN usuarios u ON mg.id_usuario = u.id_usuario
            WHERE mg.id_grupo = $1 AND mg.activo = TRUE AND u.activo = TRUE
            ORDER BY mg.rol, u.nombre
        `, [id_grupo]);
        return result.rows.map(row => ({
            id_miembro: row.id_miembro,
            id_usuario: row.id_usuario,
            id_grupo: row.id_grupo,
            fecha_union: row.fecha_union,
            rol: row.rol,
            nombre_usuario: row.nombre_usuario,
            correo: row.correo
        }));
    }

    // Verificar si existe la membresía
    static async exists(id_usuario, id_grupo) {
        const result = await pool.query(
            'SELECT COUNT(*) as count FROM miembros_grupo WHERE id_usuario = $1 AND id_grupo = $2 AND activo = TRUE',
            [id_usuario, id_grupo]
        );
        return parseInt(result.rows[0].count) > 0;
    }
}

module.exports = MiembroGrupo;