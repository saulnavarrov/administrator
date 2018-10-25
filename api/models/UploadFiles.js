/**
 * Upload.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  schema: true,
  tableName: 'uploads-files',
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    dirName: {
      type: 'string',
      required: true,
      example: 'avatar',
      // esIn: ['avatar', 'files'],
      description: `Este contendra el nombre de donde probiene el archivo
      como pueden ser de los avatares de los clientes,
      el archivo de la cedula entre otros mas documentos,
      para ser organizados en cada uno de ellos y filtrarlos`
    },

    fd: {
      type: 'string',
      required: true,
      example: '~/administrator/upload/{uploads}.jpg',
      description: `Path donde se guarda el archivo con nombre incluido,
      en caso de guardarse con ubuntu, este cambiara de la ruta
      Ubuntu: /home/{user}/administrator/uploads
      Windows: C:\/Developers\/administrador\/uploads\/`
    },

    size: {
      type: 'number',
      required: true,
      example: 2097152,
      description: `Peso o Tamaño en bytes del archivo que se subio
      2 Mb
      2098 Kb
      2097152 Bytes`
    },

    type: {
      type: 'string',
      required: true,
      example: 'aplication/pdf',
      description: `tipo de archivo que se subio al servidor para ser
      comparado y que no sea un archivo erroreo al subir ya que para
      avatars solo se permitiran archivos imagenes
      y para clientes files imagenes o pdf's`
    },

    filename: {
      type: 'string',
      required: true,
      example: 'nombre.jpeg',
      description: `Nombre del archivo con el que se guarda en el servido
      para luego ser rescatado.`
    },

    exf: {
      type: 'string',
      required: true,
      example: '.jpg',
      description: `Con este se sabra la extencion del filname ya que se parara como parametro
      en la url debido a un problema de seguridad con la extencion
      imagenes: filename.ext
      Acronimo
      exf = extension File`
    },

    filenameOriginal: {
      type: 'string',
      required: true,
      example: 'name.pdf',
      description: `Nombre del arhivo original que se subio al servidor`
    },

    status: {
      type: 'string',
      required: true,
      example: 'finished',
      description: `Estado del archivo cuando sea subido`
    },

    field: {
      type: 'string',
      required: true,
      example: 'avatar',
      description: `Nombre por donde viene el archivo adjunto para ser procesado
      este es el que se usa en 'this.req.file('avatar').
      aqui puede venir otro tipo de nombre`
    },

    extra: {
      type: 'string',
      defaultsTo: '',
      example: 'undefined',
      description: `nose para que se usa, pronto lo sabre`
    },

    src: {
      type: 'string',
      required: true,
      example: '/v/upld/:type/:file.jpg?tak=ashd...&aui=asdf...',
      description: `ruta de donde se obtendra el archivo,
      este se pedira al servidor cada vez que se requira visualizar
      dandole seguridad a los archivos del sistema y mejorar la seguridad
      poco a poco protegiendo la data mas importante para el software`
    },

    active: {
      type: 'boolean',
      required: true,
      example: true,
      description: `Aqui enfatiso que archivo es el que esta disponible para ser
      traido al cliente, con esto me ahorrare problemas legales en caunto a saber
      que archivos subieron los usuarios y cuando los esten cambiando`
    },

    tfk: {
      type: 'string',
      required: true,
      example: 'asdfasdfasdf5asd54fas6df',
      description: `token para traer el archivo y poderlo visualizar,
      este token es unico y va adjunto con el SRC de cada archivo, ya
      sea una imagen o un pdf`
    },

    uif: {
      type: 'string',
      required: true,
      example: 'asdmjfañsdfa65f6a4s',
      description: `Un segundo Token aleatorio para mejorar la seguridad
      del sistema`
    },

    confirmate: {
      type: 'boolean',
      required: true,
      example: true,
      description: `Se utilizara solo para cuando el cliente sube un archivo
      y este debe ser confirmado para ver si es real o no`
    },

    observation: {
      type: 'string',
      example: `Por favor cambie el archivo ya que no corresponde con lo socilitado bla
      bla bla`,
      description: `Aqui se pondra una observación en caso de que el archivo tenga algun error
      y este sea notificado al usuario para que lo corrija o si esta bien, se le ponga
      un OK `
    },

    onwerFile: {
      type: 'string',
      example: 'jasñdfasd6f8a4sd6fa6s5d4f5a6sfa3sd',
      description: `Id, de a quien le pertenece este archivo, avatar u otro.
      para poderlo decir de quien es realmente`
    },

    // Quien Edito este archivo y
    userId: {
      type: 'string',
      defaultsTo: '',
      example: '48ads4f6asd4f65asd5f1as5',
      description: `ID del usuario o el cliente que subio este archivo o imagen
      para responsabilizarlo del movimiento`
    }


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};

