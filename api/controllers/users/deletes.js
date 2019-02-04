/**
 * deletes.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/deletes.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/02/04
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Deletes',

  description: 'Elimina un usuario si no tiene registros en la base de datos, del resto solo se desactiva en el estado del usuario',

  extendedDescription: `Eliminara el usuario o desactivara el usuario, dependiendo de una variable
  si este ha hecho modificaciones o si ha inscrito a nuevos clientes o ha enviado mensajes, este solo se
  desactivara de manera permanente y el administrador con super poderes lo podra volver a integrar
  para que pueda volver a usar ese mismo usuario y contraseña.`,


  inputs: {
    id: {
      type: 'string',
      description: `id del usuario que se eliminara o se desactivara.`
    }
  },

  exits: {
    success: {
      description: 'Entrega de usuarios Exitosa.'
    },
    prohibido: {
      statusCode: 403,
      responseType: 'forbidden',
      description: `Usuario no se puede eliminar ya tiene movimientos o ha sido activado`
    },
    unauthorized: {
      statusCode: 401,
      responseType: 'unauthorized',
      description: 'No autorizado para ver los resultados de la pagina'
    }
  },

  fn: async function (inputs, exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    const rq = this.req;
    const _ = require('lodash');
    const moment = require('moment');
    const userId = rq.session.userId;
    const isSocket = rq.isSocket;

    let deleteUser = {};

    // Configurando Moment
    moment.locale(sails.config.custom.localeMoment);


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD SOCKET
     ***************************************************************************************/
    // Solo se aceptan solicitudes atravez de socket.io
    if (!isSocket) {
      return exits.noAuthorize({
        error: true,
        message: `Solicitud Rechazada.`
      });
    }


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS
     ***************************************************************************************/
    // Verificacion de usuario
    if (!userId) {
      return exits.unauthorized({
        error: true,
        message: 'Unauthorized'
      });
    }

    // Busco el usuario para verificar si tiene el roll suficiente para  hacer el procedimiento
    let user = await Users.findOne({
      'id': userId
    });
    let autorize = user.role <= 2 ? true : false; // Autorización de usuarios

    // Verifico que usuario tiene pases de seguridad para Eliminar el usuario
    // Solo los administradores eliminar usuarios
    if (!autorize) {
      return exits.noAuthorize({
        error: true,
        message: `No tienes permisos para realizar esta acción.
        Comunicate con el Administrador para obtener permisos
        necesarios.`
      });
    }


    /***************************************************************************************
     * BLOQUE DE DATOS OBLIGATORIOS Y REVISION DE DATA.
     ***************************************************************************************/
    // No puedes eliminar tu propio usuario
    if (rq.me.id === inputs.id) {
      this.res.status(400);
      return this.res.json({
        error: true,
        type: 'no_delete_me',
        message: 'No se puede eliminar a usted mismo como usuario'
      });
    }


    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    // Busqueda de datos en los que el usuario halla echo modificaciones y algo parecido
    let userStatus = await Users.findOne({
      id: inputs.id
    })
    .select(['id', 'status', 'emailStatus']);


    // Delete data en caso de ni una sola modificación
    if (userStatus.status === 'N') {
      deleteUser = await Users.destroy({
        id: inputs.id
      }).fetch();
    } else {
      // notificación de que no se puede eliminar el usuario
      this.res.status(403);
      return this.res.badRequest({
        status: 403,
        error: true,
        title: 'Prohibido eliminar este Usuario',
        message: `Este usuario no es posible eliminarlo, Ya cuenta con movimientos trabajados
        si desea eliminarlo de cualquier manera, pongase en contacto con el administrador, de lo contrario
        desactive el usuario para no se usado.`
      });
    }

    return exits.success({
      success: 'success',
      type: 'delete_user',
      message: 'Se ha eliminado el usuario correctamente',
      destroy: deleteUser
    });
  }
};
