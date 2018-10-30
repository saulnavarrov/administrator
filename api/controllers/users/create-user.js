/**
 * create-user.js
 * @description :: Mirar abajo la description ► ↓↓↓
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */
module.exports = {

  friendlyName: 'new acount',

  description: 'POST new acounts.',

  extendedDescription: `Formulario y control de nuevos usuarios agregados por el administrador o simplemente
  supervisados dependiendo de donde venga la solicitud`,

  inputs: {
    emailAddress: {
      required: true,
      type: 'string',
      isEmail: true,
      example: 'usuarios@example.com',
      description: 'Correo electronico adjunto de la persona para que inicie sesion'
    },
    password: {
      required: true,
      type: 'string',
      maxLength: 64,
      minLength: 6,
      example: 'passwordLOL',
      description: 'Contraseña de usuario'
    },
    name: {
      required: true,
      type: 'string',
      example: 'Salvador Peranito',
      description: 'Nombres de la persona'
    },
    lastName: {
      required: true,
      type: 'string',
      example: 'Piedras del Rio',
      description: 'Apellidos de la persona'
    },
    phone: {
      required: true,
      type: 'string',
      example: '+573147267478',
      description: 'Telefono del la persona con indicador y todo'
    },
    role: {
      type: 'number',
      example: 0,
      description: 'Rol de la persona en Numero'
    },
    isSuperAdmin: {
      type: 'boolean',
      example: false,
      description: 'Super Administrador'
    },
    emailStatus: {
      type: 'string',
      example: 'confirmed',
      description: `Confirmacion del usuario con el email. si vienen vacio se pondra "unconfirmed,"
      el cual obliga a la persona a confirmar la cuenta de email por seguridad esta puede ser cambiada
      por el usuario administrador con privilegio de super admin`
    },
    status: {
      type: 'string',
      isIn: ['E', 'I', 'B', 'N', 'ID'],
      example: 'N',
      description: `Estado del usuario al momento luego de crear una nueva`
    },
  },

  exits: {
    success: {
      statusCode: 200
    }
  },

  fn: async function (inputs, exits) {

    var newEmailAddress = inputs.emailAddress.toLowerCase();



    return exits.success();
  }
};
