parasails.registerPage('list-users', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    c: 1,
    listData: {}, // Listado de Usuarios
    userData: {}, // Usuarios individuales
    listCount: 0, // cantidad de resultados en pantalla
    listFullCount: 0, // Total de resultados
    activeModal: false, // Si el modal de Edicion o edicion esta activo
    titleModal: 'Datos de: ', // Titulo del modal que se abrira
    editTrueData: true, // Habilitar las casillas para editar el usuario
    btnCerrar: 'Cerrar', // Nombre del Btn de cerrar o descartar cambios
    updateProgress: false, // Loading Progress ajax Modal

    limit: 10, // Limite por reques
    skip: 0, // Omision de datos * limit
    allSelect: false, // selecionar todos
    searchsText: '', // Palabras de busquedas
    searching: false, // Buscando o visualizando todos los datos

    // control de paginación
    pagination: {
      a: 0,
      c: 0,
      v: 5,
      list: [],
      pre: false,
      prev: 'disabled',
      nex: false,
      next: 'disabled'
    },

    // Config display
    progressBar: true,
    tableData: false,
    footerTable: false,
    search: false,
    countData: false,
    navegationsData: false,
    numResult: false,

    // Config Alert Display
    alert: {
      active: false,
      icon: 'ion-ios-information-outline',
      title: 'Titulo de la alerta',
      message: 'Mensaje de la alerta content',
      type: 'alert-info'
    },

    // Change Image
    updateAvatar: {
      avatarFile: '',
      uploadBtn: true,
      progrees: false
    }
  },


  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: async function () {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);

    // trae toda la base de datos de usuarios
    await this.dataDb();
  },
  mounted: async function () {
    //…
  },


  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…

    /**
     * dataDb
     * @description :: Esta funcion llama a la base de datos y trae 10 primeros
     * resultados, el usuario puede tambien cambiar la cantidad de resultados
     * y la paginacion que desea ver.
     * Cuenta con la opcion de buscador integrado.
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    dataDb: async function () {
      const csrfToken = window.SAILS_LOCALS._csrf;
      const urls = '/api/v2/users';
      this.progressBar = true;

      // Control de urls find or findOne
      if (this.searching) {
        urls = '/api/v2/users/find-search';
      }

      // Request list users
      await io.socket.request({
        url: urls,
        method: 'post',
        data: {
          lim: this.limit,
          sk: this.skip,
          finds: this.searchsText
        },
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': csrfToken
        }
      }, async (rsData, jwRs) => {
        // En caso de error
        if (jwRs.error) {
          this.jwRsError(jwRs);
        }

        if (jwRs.statusCode === 200) {
          this.progressBar = false;
          this.tableData = this.search = this.footerTable = this.countData = true;
          this.listCount = rsData.list.length;
          this.listData = rsData.list;
          this.listFullCount = rsData.count;
          if (rsData.count > this.listCount) {
            this.navegationsData = this.numResult = true;
          }
          // Method Pagination()
          this.paginationCount();

          // cuando se realiza la busqueda
          if (this.searching && (this.listCount === 0)) {
            this.tableData = this.footerTable = false;
            this.alert.title = 'No hay Resultados';
            this.alert.message = `No se encontraron resultados para la busqueda: ${this.search}`;
            this.alert.active = true;
          } else {
            this.alert.active = false;
          }
        }

      });
    },

    /**
     * jwRsError
     * @description :: alertas en pantalla en caso de haber un error
     * @param {json} jwRs Datos del error
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    jwRsError: async function (jwRs) {
      this.progressBar = false;
      if (jwRs.statusCode >= 500 && jwRs.statusCode <= 502) {
        this.alert = {
          active: true,
          type: 'alert-danger',
          icon: 'ion-ios-close-outline',
          title: `Error: ${jwRs.statusCode} - ${jwRs.body}`,
          message: jwRs.error.message
        };
      } else if (jwRs.statusCode >= 400 && jwRs.statusCode <= 499) {
        this.alert = {
          active: true,
          type: 'alert-warning',
          icon: 'ion-ios-close-outline',
          title: `Error: ${jwRs.statusCode} - ${jwRs.body}`,
          message: jwRs.error.message
        };
      }
    },

    /**
     * paginationCount
     * @description :: .
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    paginationCount: async function () {},

    /**
     * paginationClick
     * @description :: .
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    paginationClick: async function () {},

    /**
     * skipData
     * @description :: .
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    skipData: async function () {},

    /**
     * selectAll
     * @description :: .
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    selectAll: async function () {},

    /**
     * findOneSearch
     * @description :: .
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    findOneSearch: async function () {},

    /**
     * findEndSearch
     * @description :: .
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    findEndSearch: async function () {},

    /**
     * findOneUserView
     * @description :: .
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    findOneUserView: async function () {},

    /**
     * findOneUserEdit
     * @description :: .
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    findOneUserEdit: async function () {},

    /**
     * closeModalView
     * @description :: .
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    closeModalView: async function () {},

    /**
     * btnUpdateUser
     * @description :: .
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    btnUpdateUser: async function () {},

    /**
     * updateUserData
     * @description :: .
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    updateUserData: async function () {},

    /**
     * onChangeAvatar
     * @description :: .
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    onChangeAvatar: async function () {},

    /**
     * updateChangeAvatar
     * @description :: .
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    updateChangeAvatar: async function () {},

    /**
     * toUnlockUser
     * @description :: .
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    toUnlockUser: async function () {},

    /**
     * deleteUser
     * @description :: .
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    deleteUser: async function () {},
  }
});
