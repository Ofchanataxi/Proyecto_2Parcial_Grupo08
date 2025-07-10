const pool = require('../config/db');

class Grupo {
    constructor(id_grupo, nombre_grupo, descripcion, fecha_creacion, activo) {
        this.id_grupo = id_grupo;
        this.nombre_grupo = nombre_grupo;
        this.descripcion = descripcion;
        this.fecha_creacion = fecha_creacion;
        this.activo = activo;
    }

    static async getAll() {
        const result = await pool.query('SELECT * FROM grupos WHERE activo = TRUE ORDER BY id_grupo');
        return result.rows.map(row => ({
            id_grupo: row.id_grupo,
            nombre_grupo: row.nombre_grupo,
            descripcion: row.descripcion,
            fecha_creacion: row.fecha_creacion,
            activo: row.activo
        }));
    }

    static async getById(id_grupo) {
        const result = await pool.query('SELECT * FROM grupos WHERE id_grupo = $1 AND activo = TRUE', [id_grupo]);
        if (result.rows.length > 0) {
            return new Grupo(
                result.rows[0].id_grupo,
                result.rows[0].nombre_grupo,
                result.rows[0].descripcion,
                result.rows[0].fecha_creacion,
                result.rows[0].activo
            );
        } else {
            throw new Error('Grupo no encontrado');
        }
    }

    static async create(grupo) {
        const result = await pool.query(
            'INSERT INTO grupos (nombre_grupo, descripcion, fecha_creacion) VALUES ($1, $2, $3) RETURNING *',
            [grupo.nombre_grupo, grupo.descripcion, grupo.fecha_creacion || new Date()]
        );
        return new Grupo(
            result.rows[0].id_grupo,
            result.rows[0].nombre_grupo,
            result.rows[0].descripcion,
            result.rows[0].fecha_creacion,
            result.rows[0].activo
        );
    }

    static async update(id_grupo, grupo) {
        const result = await pool.query(
            'UPDATE grupos SET nombre_grupo = $1, descripcion = $2, fecha_creacion = $3, updated_at = CURRENT_TIMESTAMP WHERE id_grupo = $4 AND activo = TRUE RETURNING *',
            [grupo.nombre_grupo, grupo.descripcion, grupo.fecha_creacion, id_grupo]
        );
        if (result.rows.length > 0) {
            return new Grupo(
                result.rows[0].id_grupo,
                result.rows[0].nombre_grupo,
                result.rows[0].descripcion,
                result.rows[0].fecha_creacion,
                result.rows[0].activo
            );
        } else {
            throw new Error('Grupo no encontrado');
        }
    }

    static async delete(id_grupo) {
        const result = await pool.query('UPDATE grupos SET activo = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id_grupo = $1 RETURNING *', [id_grupo]);
        if (result.rows.length > 0) {
            return new Grupo(
                result.rows[0].id_grupo,
                result.rows[0].nombre_grupo,
                result.rows[0].descripcion,
                result.rows[0].fecha_creacion,
                result.rows[0].activo
            );
        } else {
            throw new Error('Grupo no encontrado');
        }
    }

    // Obtener miembros del grupo
    static async getMiembros(id_grupo) {
        const result = await pool.query(`
            SELECT u.*, mg.rol, mg.fecha_union 
            FROM usuarios u
            INNER JOIN miembros_grupo mg ON u.id_usuario = mg.id_usuario
            WHERE mg.id_grupo = $1 AND u.activo = TRUE AND mg.activo = TRUE
            ORDER BY u.nombre
        `, [id_grupo]);
        return result.rows.map(row => ({
            id_usuario: row.id_usuario,
            nombre: row.nombre,
            correo: row.correo,
            fecha_registro: row.fecha_registro,
            rol: row.rol,
            fecha_union: row.fecha_union
        }));
    }

    // Obtener estadísticas del grupo
    static async getEstadisticas(id_grupo) {
        const result = await pool.query(`
            SELECT 
                COUNT(*) as total_miembros,
                COUNT(CASE WHEN mg.rol = 'administrador' THEN 1 END) as administradores,
                COUNT(CASE WHEN mg.rol = 'moderador' THEN 1 END) as moderadores,
                COUNT(CASE WHEN mg.rol = 'miembro' THEN 1 END) as miembros_regulares
            FROM miembros_grupo mg
            WHERE mg.id_grupo = $1 AND mg.activo = TRUE
        `, [id_grupo]);
        return result.rows[0];
    }
}

module.exports = Grupo;