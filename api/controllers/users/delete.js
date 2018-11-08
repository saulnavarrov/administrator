/**
 * list.js
 * @description :: Mirar abajo la description ► ↓↓↓
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */
module.exports = {
  friendlyName: 'users/delete',

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

    unauthorized: {
      statusCode: 401,
      responseType: 'unauthorized',
      description: 'No autorizado para ver los resultados de la pagina'
    }
  },

  fn: async function (inputs, exits) {
    let _ = require('lodash');
    let moment = require('moment');
    let rq = this.req;
    let userId = rq.session.userId;

    // Configurando Moment
    moment.locale(sails.config.custom.localeMoment);

    // Verificacion de usuario
    if (!userId && !isSocket) {
      return exits.unauthorized({
        error: true,
        message: 'Unauthorized'
      });
    }

    // autorización para usuarios administradores y super admin
    if (rq.me.role > 1 && !rq.me.isSuperAdmin) {
      return exits.unauthorized({
        error: true,
        title: 'Unauthorized',
        message: 'No tiene permitido realizar esta acción, pongase en contacto con el administrador del sistema'
      });
    }

    // No puedes eliminar tu propio usuario
    if (rq.me.id === inputs.id){
      this.res.status(400);
      return this.res.json({
        error: true,
        type: 'no_delete_me',
        message: 'No se puede eliminar a usted mismo como usuario'
      });
    }

    // Busqueda de datos en los que el usuario halla echo modificaciones y algo parecido


    // Delete data en caso de ni una sola modificación
    let deleteUser = await User.destroy({id: inputs.id}).fetch();

    // Desactivación del usuario


    return exits.success({
      success: 'success',
      type: 'delete_user',
      message: 'Se ha eliminado el usuario correctamente',
      destroy: deleteUser
    });
  }
};
