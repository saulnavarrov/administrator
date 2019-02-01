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
    progressBar: {
      active: true,
      animated: ''
    },
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
      type: 'alert-info',
      animated: '',
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
     * progressBarD
     * @description :: Control de la barra de carga en pantalla, la cual
     * tendra un efecto y un control de entrada y salida.
     * @param {Boolean} act :: Activar o desactivar
     * @param {String} ani :: Animación que se vera en pantalla
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    progressBarD: async function (act,ani) {
      // Activar
      if (act) {
        this.progressBar.active = true;
        this.progressBar.animated = ani;
      } else {
        this.progressBar.animated = 'fadeOut faster';
        setTimeout(() => {
          this.progressBar.active = false;
          this.progressBar.animated = '';
        }, 505);
      }
    },

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
      let urls = '/api/v2/users';
      this.progressBarD(true, 'fadeInRight faster');

      // Data enviada a la API
      let data = {
        lim: this.limit,
        sk: this.skip,
      };

      // Control de urls find or findOne
      if (this.searching) {
        urls = '/api/v2/users/search';
        data.finds = this.searchsText;
      }

      // Request list users
      await io.socket.request({
        url: urls,
        method: 'post',
        data: data,
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': csrfToken
        }
      }, async (rsData, jwRs) => {
        // En caso de error
        if (jwRs.error) {
          this.jwRsError(jwRs);
        }

        // Borrar alerta en caso de estar activa warning
        if (this.alert.active === true && this.alert.animated === 'zoomIn') {
          this.alert.animated = 'zoomOut faster';
          setTimeout(() => {
            this.alert.active = false;
            this.alert.animated = '';
          }, 505);
        }

        // Success
        if (jwRs.statusCode === 200) {
          this.progressBarD(false);
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
            // Animación de entrada
            this.searchAnimated(true, 'bounceIn');
          } else {
            // Animación de salida.
            this.searchAnimated(false);
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
      this.progressBarD(false);
      if (jwRs.statusCode >= 500 && jwRs.statusCode <= 502) {
        this.alert = {
          active: true,
          animated: 'zoomIn',
          type: 'alert-danger',
          icon: 'ion-ios-close-outline',
          title: `Error: ${jwRs.statusCode} - ${jwRs.body}`,
          message: jwRs.error.message
        };
      } else if (jwRs.statusCode >= 400 && jwRs.statusCode <= 405) {
        this.alert = {
          active: true,
          animated: 'zoomIn',
          type: 'alert-warning',
          icon: 'ion-ios-close-outline',
          title: `Error: ${jwRs.statusCode} - ${jwRs.body}`,
          message: jwRs.error.message
        };
      } else if (jwRs.statusCode === 406) {
        this.alert = {
          active: true,
          type: 'alert-warning',
          animated: 'zoomIn',
          icon: 'ion-ios-close-outline',
          title: `Error: ${jwRs.statusCode} - ${jwRs.body.type}`,
          message: jwRs.body.data
        };
      }
    },


    /**
     * paginationCount
     * @description :: Configuracion y renderizacion de paginacion
     * para visualizarla en pantalla
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    paginationCount: async function () {
      // calcula la paginacion con desimales
      let a = Number(this.listFullCount) / Number(this.limit);
      // Calcula y redondea hacia arriba la paginacion
      let b = this.pagination.c = Math.ceil(a.toFixed(3));
      // para cuando es menor que 5 devuelva la cantidad de b
      let s = b > this.pagination.v ? this.pagination.v : b;

      // Nuevos calculos para paginacion
      // Variables de configuracion del paginador
      let o = 0; // Arranque del config render
      let p = 2; // Minimo numero antes de centrar select
      let q = 3; // Num Maximo para centrar select
      let r = this.skip; // Skip data
      let m = b; // Num Maximo de Paginaciones
      let l = s; // Num Minimo de Paginaciones Itera si es menor a 5
      let j = r > p ? r - p : 0; // Calculo de centrado
      let k = r > p ? l + r : l; // Calculo de centrado

      // Limpia la lista para volverla a renderizar
      this.pagination.list = [];

      // Config Render Page
      for (o; o < b; o++) {
        this.pagination.list[o] = {
          nn: o + 1,
          aa: '',
          ss: false
        };
      }

      // Renderiza los datos de paginacion activos
      for (j; j < k; j++) {
        // Para mantener la paginacion del 1 al 3
        if (r < q) {
          this.pagination.list[j] = {
            nn: j + 1,
            aa: j === this.pagination.a ? 'active' : '',
            ss: true
          };
        } else if (j < (k - p) && j < m) {
          // Para dar continuacion de 2 en adelante hasta donde
          // alcance la variable "b"
          this.pagination.list[j] = {
            nn: j + 1,
            aa: j === this.pagination.a ? 'active' : '',
            ss: true
          };
        }
      }

      // activate prev
      if (this.pagination.a > 0 && this.pagination.c > this.pagination.v) {
        this.pagination.prev = '';
        this.pagination.pre = true;
      } else {
        this.pagination.prev = 'disabled';
        this.pagination.pre = false;
      }

      // activate next
      if ((this.pagination.a + 1) < this.pagination.c && this.pagination.c > this.pagination.v) {
        this.pagination.next = '';
        this.pagination.nex = true;
      } else {
        this.pagination.next = 'disabled';
        this.pagination.nex = false;
      }
    },


    /**
     * paginationClick
     * @description :: control de la paginacion, esta me permite
     * omitir una cantidad de datos el modificador es skip
     * @param {Number} e :: Numero con el que se omitira una cantidad 'x'
     * de datos para ser visualizados, este funciona mucho con this.limit
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    paginationClick: async function (e) {
      // Cuando viene un numero
      if (typeof (e) === 'number') {
        // No sobrepase la paginacion
        if ((this.pagination.a > 0) || ((this.pagination.a + 1) < this.pagination.c)) {
          this.skip = e;
          this.pagination.a = e;
          this.dataDb();
        }
      }
    },


    /**
     * skipData
     * @description :: Calcula, cambia y activa la paginación minima, en caso
     * de que la paginación este en 10 y se cambie el limite de resultados
     * para que aparescan mas, esto selecciona en numero maximo que queda
     * y configura la pagianción para que se pueda ver.
     * fucniona con el limit y this.paginationCount();
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    skipData: async function () {
      // Calculando Skip
      let pres = this.listFullCount - (this.limit * this.skip);
      let p = pres / this.limit;
      p = Math.ceil(p.toFixed(2));

      // Entrando al bucle
      if (this.listFullCount !== 0 && p < 1) {
        let n = p;
        while (n < 1) {
          n++;
          this.skip = this.skip - 1;
          this.pagination.a = this.skip;
        }
      }

      // Ejecicion del request
      this.dataDb();
    },


    /**
     * selectAll
     * @description :: Selecciona todos los datos que estan en pantalla
     * si hay uno seleccionado o varios y selecciona todos, este realiza
     * una seleccion inversa a los datos seleccionados manualmente.
     * @param {Number} x :: DEpendiendo de lo que se halla sellecionado
     * aqui cambiara el tipo de seleccion: todo, nada o inverso
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    selectAll: async function (x) {
      // Verificando Variable de selección
      if (typeof(x) === 'string') {
        // llama la lista y los va seleccionando 1 por 1
        for (let d of this.listData) {
          // Seleccionar todo en pantalla
          if (x === 'a') {
            console.log(d.check);
            d.check = true;
          }
          // Deseleccionar todo
          else if (x === 'z') {
            d.check = false;
          }
          // invertir selección
          else if (x === 'c') {
            if (!d.check) {
              d.check = true;
            } else {
              d.check = false;
            }
          }
        }
      }else{
        console.error(new Error(`Variable no admitida`));
      }
    },


    /**
     * findOneSearch
     * @description :: Realiza una busqueda en la base de datos que coincidan
     * con lo escrito en pantalla
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    findOneSearch: async function () {
      // Reinicia el buscador
      if (!this.searching) {
        if (this.skip > 0) {
          this.skip = 0;
          this.pagination.a = 0;
        }
        if (this.limit > 10) {
          this.limit = 10;
        }
      }

      // Se activa el modo busqueda en la funcion this.dataDB()
      this.searching = true;

      // realiza la busqueda si searching esta en true y
      // si hay al menos 3 caracteres en pantalla escrito
      if (this.searching && this.searchsText.length !== 0) {
        this.dataDb();
      } else {
        this.searching = false;
        // Animación de salida.
        this.searchAnimated(false);
        // Reactivar lista
        this.dataDb();
      }
    },


    /**
     * findEndSearch
     * @description :: Reinicia la busqueda y pone en pantalla
     * el listado original de datos sin busqueda si se presiona la
     * "X" que esta al lado de la caja de texto.
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    findEndSearch: async function () {
      if (this.searching && this.searchsText.length > 0) {
        this.searching = false;
        this.searchsText = '';
        // Animación de salida.
        this.searchAnimated(false);
        // Ejecicion del request
        this.dataDb();
      } else {
        // Blanqueando Caja
        this.searchsText = '';
        // Animación de salida.
        this.searchAnimated(false);
      }
    },


    /**
     *
     * @param {Boolean} act
     * @param {String} ani :: Animación que se ejecutara
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    searchAnimated: async function (act,ani) {
      if (act) {
        this.alert.type = 'alert-info';
        this.alert.active = act;
        this.alert.animated = ani;
      } else {
        // Animación Salida
        this.alert.animated = 'fadeOut faster';
        setTimeout(() => {
          this.alert.active = act;
          this.alert.animated = '';
        }, 505);
      }
    },


    /**
     * closeModalView
     * @description ::  Cierra el modal que esta abierto y deja los estados
     * como active modal el false, y editTrueModal false
     * por si se abre el modal en modo vista no abra en modo edición
     * @param {string} modal titulo del modal
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    closeModalView: async function (modal) {
      this.activeModal = false;
      this.editTrueData = true;
      $(`#${modal}`).modal('hide');
      this.btnCerrar = 'cerrar';
      this.userData = {}; // Limpia los Datos
    },


    /**
     * findOneUserView
     * @description :: Buscara el usuario seleccionado para ver todos los
     * datos en pantalla, tambien sirve de base para editar el mismo usuario
     * evitando repetir codigo.
     * @param {string} id :: identificación del usuario en la base de datos.
     * @param {string} title :: Titulo del modal, este cambiara si pasa de vista
     * a edición o si se ponen en modo edición
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    findOneUserView: async function (id, title) {
      let csrfToken = window.SAILS_LOCALS._csrf;
      let urls = '/api/v2/users/find-one';
      let modal = $('#pm-view-and-edith-user');
      this.titleModal = 'Datos de: ';
      this.progressBarD(true, 'fadeInRight faster');

      // Cambio de titulo de la ventana
      if (typeof (title) !== 'undefined') {
        this.titleModal = title;
      } else {
        // No permite editar
        this.editTrueData = true;
      }

      // request list users
      await io.socket.request({
        url: urls,
        method: 'post',
        data: {
          id: id
        },
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': csrfToken
        }
      }, (rsData, jwRs) => {
        // En caso de error
        if (jwRs.error) {
          this.jwRsError(jwRs);
        }

        if (jwRs.statusCode === 200) {
          console.log(rsData);
          // Desactiva el progrees
          this.progressBarD(false);
          // carga los datos
          this.userData = rsData.user;
          // pone el estado del modal en activo
          this.activeModal = true;

          // Eject Modal
          modal.modal('show');
        }

      });
    },


    /**
     * editUser
     * @description :: Habilita la edicion del usuario en la ventana del view
     * para mayor facilidad y trabajo
     * @param {string} id :: identificación del usuario en la base de datos.
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    editUser: async function (id) {
      // Verifica si el modal esta activo para ejecutar el request
      if (!this.activeModal) {
        this.btnCerrar = 'Descartar Cambios';
        this.editTrueData = false; // Permite editar los datos
        this.findOneUserView(id, 'Editar datos de: ');
      } else {
        // Si el modal esta habierto cambia el titulo habilita
        // la edicion del usuario
        this.btnCerrar = 'Descartar Cambios';
        this.titleModal = 'Editar datos de: '; // Cambia el titulo del modal
        this.editTrueData = false; // Permite editar los datos
      }
    },


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
