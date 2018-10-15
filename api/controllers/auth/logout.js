module.exports = {

  friendlyName: 'Login',

  description: 'POST Logout.',

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
