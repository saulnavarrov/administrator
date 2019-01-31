/**
 * create-users.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/create-users.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/01/28
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Create users',

  description: `Creación de usuarios de trabajo.`,

  extendedDescription: `Formulario y control de nuevos usuarios agregados por el administrador o simplemente
  supervisados dependiendo de donde venga la solicitud`,

  inputs: {
    identification: {
      type:'string',
      example: 'CC1028004969',
      description: `Numero de identificacion de las personas sea cedula entre otras`
    },
    emailAddress: {
      type: 'string',
      isEmail: true,
      example: 'usuarios@example.com',
      description: 'Correo electronico adjunto de la persona para que inicie sesion'
    },
    password: {
      type: 'string',
      maxLength: 64,
      minLength: 6,
      example: 'passwordLOL',
      description: 'Contraseña de usuario'
    },
    name: {
      type: 'string',
      example: 'Salvador Peranito',
      description: 'Nombres de la persona'
    },
    lastName: {
      type: 'string',
      example: 'Piedras del Rio',
      description: 'Apellidos de la persona'
    },
    phone: {
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
    },

    noAuthorize: {
      responseType: 'unauthorized',
      description: 'No autorizado para acer esta acción'
    },
  },

  fn: async function (inputs, exits) {
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    const rq = this.req;
    const _ = require('lodash');
    const moment = require('moment');
    const userId = rq.session.userId;
    let dateForm = {};


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD SOCKET
     ***************************************************************************************/
    // Solo se aceptan solicitudes atravez de socket.io
    if (!rq.isSocket) {
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
    let user = await Users.findOne({'id': userId});
    let autorize = user.role <= 2 ? true : false; // Autorización de usuarios

    // Verifico que usuario tiene pases de seguridad para crear el nuevo usuario
    // Solo los administradores y supervisores pueden crear nuevos usuarios para trabajar
    //  en uniempresas
    if(!autorize){
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
    // Organizando data
    let identification = _.isUndefined(inputs.identification) ? false : inputs.identification;
    let emailAddress = _.isUndefined(inputs.emailAddress) ? false : inputs.emailAddress;
    let password = _.isUndefined(inputs.password) ? false : inputs.password;
    let name = _.isUndefined(inputs.name) ? false : inputs.name;
    let lastName = _.isUndefined(inputs.lastName) ? false : inputs.lastName;
    let phone = _.isUndefined(inputs.phone) ? false : inputs.phone;
    let role = _.isUndefined(inputs.role) ? false : inputs.role;
    let isSuperAdmin = _.isUndefined(inputs.isSuperAdmin) ? false : inputs.isSuperAdmin;
    let emailStatus = _.isUndefined(inputs.emailStatus) ? false : inputs.emailStatus;
    let status = _.isUndefined(inputs.status) ? false : inputs.status;

    // Datos necesarios para crear el nuevo usuario
    if (!identification || !emailAddress || !password || !name || !lastName || !phone || !role || !status) {
      this.res.status(400);
      return this.res.badRequest({
        status: 400,
        error: true,
        data: 'Faltan datos para crear el usuario',
        type: 'incomplete_Data',
        form: {
          identification: !identification ? 'is-invalid' : '',
          emailAddress: !emailAddress ? 'is-invalid' : '',
          password: !password ? 'is-invalid' : '',
          name: !name ? 'is-invalid' : '',
          lastName: !lastName ? 'is-invalid' : '',
          phone: !phone ? 'is-invalid' : '',
          role: !role ? 'is-invalid' : '',
          emailStatus: !emailStatus ? 'is-invalid' : '',
          status: !status ? 'is-invalid' : ''
        }
      });
    }



    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    // Evaluando data y que sea unica
    let evalIdentification = await Users.findOne({
      identification: identification
    }).select(['id']);
    let evalPhone = await Users.findOne({
      phone: phone
    }).select(['id']);
    let evalEmailAddress = await Users.findOne({
      emailAddress: emailAddress
    }).select(['id']);

    // Evaluación de información que existe o no
    if (!_.isUndefined(evalEmailAddress) || !_.isUndefined(evalIdentification) || !_.isUndefined(evalPhone)) {
      this.res.status(400);
      return this.res.badRequest({
        status: 400,
        error: true,
        type: 'existing_data',
        data: {
          email: !_.isUndefined(evalEmailAddress) ? 'is-invalid' : '',
          identification: !_.isUndefined(evalIdentification) ? 'is-invalid' : '',
          phone: !_.isUndefined(evalPhone) ? 'is-invalid' : '',
        },
        message: {
          email: !_.isUndefined(evalEmailAddress) ? 'Email: Ya existe' : '',
          identification: !_.isUndefined(evalIdentification) ? 'Identificación: Ya existe' : '',
          phone: !_.isUndefined(evalPhone) ? 'Telefono: Ya existe' : ''
        }
      });
    }

    // Adjuntando Super User, si el un Super usuario lo crea
    if (user.isSuperAdmin) {
      dateForm.isSuperAdmin = isSuperAdmin;
    }

    // Permisos para agregar a un super admin
    // No puede dar un rol mas alto que el suyo
    if (Number(rq.me.role) >= Number(role)) {
      this.res.status(403);
      return this.res.badRequest({
        status: 403,
        error: true,
        type: 'Rol no Autorizado',
        message: `No tiene permisos para realizar agregar este rol a este usuario.
        Comuniquese con el administrador para dar este rolo a: ${name}`
      });
    }

    // Creando json de archivos
    dateForm.identification = _.toLower(identification);
    dateForm.emailAddress = _.toLower(emailAddress);
    dateForm.password = await sails.helpers.passwords.hashPassword(password);
    dateForm.name = _.startCase(_.toLower(name));
    dateForm.lastName = _.startCase(_.toLower(lastName));
    dateForm.phone = phone;
    dateForm.role = Number(role);
    dateForm.status = status;

    dateForm.emailStatus = emailStatus;

    // Exige verificación por email
    if (sails.config.custom.verifyEmailAddresses) {
      dateForm.emailProofToken = await sails.helpers.strings.random('url-friendly');
      dateForm.emailProofTokenExpiresAt = Date.now() + sails.config.custom.emailProofTokenTTL;
    }


    // CREANDO USUARIO ====
    let createUser = await Users.create(dateForm).fetch();

    // Enviando Mensaje por Email para Confirmar el correo electronico
    if (sails.config.custom.verifyEmailAddresses) {
      await sails.helpers.sendTemplateEmail.with({
        to: createUser.emailAddress,
        subject: 'Por Favor Confirmar Email',
        template: 'email-verify-account',
        templateData: {
          fullName: `${dateForm.name} ${dateForm.lastName}`,
          token: createUser.emailProofToken
        }
      });
    }

    // Eliminando el Password
    delete createUser.password;

    // Reconfigurando Dadatime
    createUser.emailProofTokenExpiresAt = moment(createUser.emailProofTokenExpiresAt).format('llll');

    // Devolviendo data
    return exits.success({
      status: 'success',
      message: 'El usuario Ha sido creado con exito',
      user: createUser
    });
  }
};
