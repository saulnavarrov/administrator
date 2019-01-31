/**
 * logout.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/auth/logout.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/01/24
 * @version 1.0
 */

module.exports = {

  friendlyName: 'logout',

  description: 'Get Logout.',

  extendedDescription: `Accion para cerrar la session del usuario.`,

  inputs: {},

  exits: {

    success: {
      description: 'The requesting user agent has been successfully logged out.'
    },

    redirect: {
      description: 'The requesting user agent looks to be a web browser.',
      extendedDescription: 'After logging out from a web browser, the user is redirected away.',
      responseType: 'redirect'
    }

  },


  fn: async function (inputs, exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    const rq = this.req;
    const userId = rq.session.userId;


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS
     ***************************************************************************************/
    // Verifico si hay una session iniciada, si no es asi
    // redirija al login
    if (!userId) {
      throw {
        redirect: '/login'
      };
    }


    // Si se encuentra una sesion iniciada
    // se realizara el procedimiento adecuado
    await AttemptsLogin.create({
      email: this.req.me.emailAddress,
      successType: 'logout',
      user: this.req.session.userId,
      success: 'true',
      ip: this.req.headers['x-forwarded-for'],
      port: this.req.protocol
    });

    // Clear the `userId` property from this session.
    delete this.req.session.userId;

    // Then finish up, sending an appropriate response.
    // > Under the covers, this persists the now-logged-out session back
    // > to the underlying session store.
    if (!this.req.wantsJSON) {
      throw {
        redirect: '/login'
      };
    } else {
      return exits.success();
    }

    // if (!this.req.session.userId) {
    //   // Clear the `userId` property from this session.
    //   throw {
    //     redirect: '/login'
    //   };
    // }else{
    //   delete this.req.session.userId;
    //   throw {
    //     redirect: '/login'
    //   };
    // }



    // Then finish up, sending an appropriate response.
    // > Under the covers, this persists the now-logged-out session back
    // > to the underlying session store.
    // if (!this.req.wantsJSON) {
    // } else {
    // return exits.success();
    // }

  }


};
