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
    identification: {
      type:'string',
      example: 'CC1028004969',
      description: `Numero de identificacion de las personas sea cedula entre otras`
    },
    emailAddress: {
      // required: true,
      type: 'string',
      isEmail: true,
      example: 'usuarios@example.com',
      description: 'Correo electronico adjunto de la persona para que inicie sesion'
    },
    password: {
      // required: true,
      type: 'string',
      maxLength: 64,
      minLength: 6,
      example: 'passwordLOL',
      description: 'Contraseña de usuario'
    },
    name: {
      // required: true,
      type: 'string',
      example: 'Salvador Peranito',
      description: 'Nombres de la persona'
    },
    lastName: {
      // required: true,
      type: 'string',
      example: 'Piedras del Rio',
      description: 'Apellidos de la persona'
    },
    phone: {
      // required: true,
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
    let rq = this.req;
    const _ = require('lodash');
    const moment = require('moment');
    let dateForm = {};

    // Verificacion de usuario
    if (!rq.session.userId) {
      return exits.unauthorized({
        error: true,
        message: 'Unauthorized'
      });
    }

    // No se aceptan solicitudes atravez de socket.io
    if (!rq.isSocket) {
      return exits.noAuthorize({
        error: true,
        message: `Socket.io no soportado.`
      });
    }

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

    // Solo los administradores y supervisores pueden crear nuevos usuarios para trabajar
    //  en uniempresas
    if (Number(rq.me.role) > 3) {
      return exits.noAuthorize({
        error: true,
        message: `No tienes permisos para realizar esta acción.
        Comunicate con el Administrador para obtener permisos
        necesarios.`
      });
    }

    // Datos necesarios para crear el nuevo usuario
    if(!identification || !emailAddress || !password || !name || !lastName || !phone || !role || !status) {
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

    // Evaluando data y que sea unica
    let evalIdentification = await User.findOne({identification: identification}).select(['id']);
    let evalPhone = await User.findOne({phone: phone}).select(['id']);
    let evalEmailAddress = await User.findOne({emailAddress: emailAddress}).select(['id']);

    // Evaluación de información que existe o no
    if (!_.isUndefined(evalEmailAddress) || !_.isUndefined(evalIdentification) || !_.isUndefined(evalPhone) ) {

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
          email: !_.isUndefined(evalEmailAddress) ? 'Email: Ya existe':'',
          identification: !_.isUndefined(evalIdentification) ? 'Identificación: Ya existe':'',
          phone: !_.isUndefined(evalPhone) ? 'Telefono: Ya existe':''
        }
      });
    }

    // Adjuntando Super User, si el un Super usuario lo crea
    if (rq.me.isSuperAdmin) {
      dateForm.isSuperAdmin = isSuperAdmin;
    }

    // Permisos para agregar a un super admin
    if ( Number(rq.me.role) >= Number(role) ) {
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

    // Creando Usuario
    let createUser = await User.create(dateForm).fetch();

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

/*
IMPORTANTE:

agergar el identicador en la edición data de list page modal
para ver el contenido, para editarlo disabled

luego trabajar en el envio de la contraseña,
trabajar en controlador

validar usuario que si tenga privilegios
validar datos y devolver información
luego devolver la data y mostrarla en pantalla como un modal recien creado.
 */
