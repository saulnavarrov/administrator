module.exports = {
  friendlyName: '',

  description: '',

  extendedDescription: ``,

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {

    let rq = this.req;
    let usersArray = await User.find(); // Todos los usuarios
    let users = []; // array de usuario nuevo
    // let userId = rq.session.userId;
    // let isSocket = rq.isSocket;

    // Protegiendo el Password para no visualizarlo en Json
    for (user of usersArray) {
      delete user.password;
      users.push(user);
    }

    return exits.success({
      model: 'users',
      list: users
    });
  }
};
