const pool = require('../config/db');

class Usuario {
    constructor(id_usuario, nombre, correo, fecha_registro, activo) {
        this.id_usuario = id_usuario;
        this.nombre = nombre;
        this.correo = correo;
        this.fecha_registro = fecha_registro;
        this.activo = activo;
    }

    static async getAll() {
        const result = await pool.query('SELECT * FROM usuarios WHERE activo = TRUE ORDER BY id_usuario');
        return result.rows.map(row => ({
            id_usuario: row.id_usuario,
            nombre: row.nombre,
            correo: row.correo,
            fecha_registro: row.fecha_registro,
            activo: row.activo
        }));
    }

    static async getById(id_usuario) {
        const result = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1 AND activo = TRUE', [id_usuario]);
        if (result.rows.length > 0) {
            return new Usuario(
                result.rows[0].id_usuario,
                result.rows[0].nombre,
                result.rows[0].correo,
                result.rows[0].fecha_registro,
                result.rows[0].activo
            );
        } else {
            throw new Error('Usuario no encontrado');
        }
    }

    static async create(usuario) {
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, correo, fecha_registro) VALUES ($1, $2, $3) RETURNING *',
            [usuario.nombre, usuario.correo, usuario.fecha_registro || new Date()]
        );
        return new Usuario(
            result.rows[0].id_usuario,
            result.rows[0].nombre,
            result.rows[0].correo,
            result.rows[0].fecha_registro,
            result.rows[0].activo
        );
    }

    static async update(id_usuario, usuario) {
        const result = await pool.query(
            'UPDATE usuarios SET nombre = $1, correo = $2, fecha_registro = $3, updated_at = CURRENT_TIMESTAMP WHERE id_usuario = $4 AND activo = TRUE RETURNING *',
            [usuario.nombre, usuario.correo, usuario.fecha_registro, id_usuario]
        );
        if (result.rows.length > 0) {
            return new Usuario(
                result.rows[0].id_usuario,
                result.rows[0].nombre,
                result.rows[0].correo,
                result.rows[0].fecha_registro,
                result.rows[0].activo
            );
        } else {
            throw new Error('Usuario no encontrado');
        }
    }

    static async delete(id_usuario) {
        const result = await pool.query('UPDATE usuarios SET activo = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id_usuario = $1 RETURNING *', [id_usuario]);
        if (result.rows.length > 0) {
            return new Usuario(
                result.rows[0].id_usuario,
                result.rows[0].nombre,
                result.rows[0].correo,
                result.rows[0].fecha_registro,
                result.rows[0].activo
            );
        } else {
            throw new Error('Usuario no encontrado');
        }
    }

    // Obtener grupos del usuario
    static async getGrupos(id_usuario) {
        const result = await pool.query(`
            SELECT g.*, mg.rol, mg.fecha_union 
            FROM grupos g
            INNER JOIN miembros_grupo mg ON g.id_grupo = mg.id_grupo
            WHERE mg.id_usuario = $1 AND g.activo = TRUE AND mg.activo = TRUE
            ORDER BY g.nombre_grupo
        `, [id_usuario]);
        return result.rows.map(row => ({
            id_grupo: row.id_grupo,
            nombre_grupo: row.nombre_grupo,
            descripcion: row.descripcion,
            fecha_creacion: row.fecha_creacion,
            rol: row.rol,
            fecha_union: row.fecha_union
        }));
    }
}

module.exports = Usuario;