/**
 * view-new-password.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/view-new-password.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/01/23
 * @version 1.0
 */
module.exports = {

  friendlyName: 'View New Passwords',

  description: 'Display "Reset New Password" page.',

  inputs: {

  },

  exits: {

  },

  fn: async function (inputs, exits) {

    // Respond with view.
    return exits.success();
  }
};
