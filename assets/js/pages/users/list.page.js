parasails.registerPage('list-users', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    c: 1,
    listData: {}, // Listado de Usuarios
    userData: {}, // Usuarios individuales
    changeEmail: {newEmail :'',confirmNewEmail :'',error:'',errorText:''}, // Para cambiar el correo electronico
    changePassword: {}, // Para cambiar la contraseña del usuario
    listCount: 0, // cantidad de resultados en pantalla
    listFullCount: 0, // Total de resultados
    activeModal: false, // Si el modal de Edicion o edicion esta activo
    titleModal: 'Datos de: ', // Titulo del modal que se abrira
    editTrueData: true, // Habilitar las casillas para editar el usuario
    btnCerrar: 'Cerrar', // Nombre del Btn de cerrar o descartar cambios
    updateProgress: false, // Loading Progress ajax Modal Actualización de datos
    modalProgress: false, // Progreso para nuevos modales

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
      progress: false
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
    // Activa el ProgressBar de cargando usuarios
    // this.progressBarD(true, 'fadeInRight faster');
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
     * closeAlertD
     * @description :: Cierra el alerta en pantalla.
     * @param {Boolean} act :: Activa o desactiva la alerta
     * @param {String} ani :: Tipo de animación
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    closeAlertD: async function (act, ani) {
      this.alert.animated = 'fadeOut faster';
      setTimeout(() => {
        this.alert.active = false;
        this.alert.animated = '';
      }, 505);
    },

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

      // Activa el ProgressBar de cargando usuarios
      !this.progressBar.active ? this.progressBarD(true, 'fadeInRight faster') : '';

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
            this.alert.message = `No se encontraron resultados para la busqueda: "${this.searchsText}"`;
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
     * @param {Boolean} display :: Usado solo para el Error 404 en caso de
     * querer ver el error 'NotFound' en ventana emergente. y no como una alerta
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    jwRsError: async function (jwRs, display) {
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
      } else if (jwRs.statusCode >= 400 && jwRs.statusCode <= 403) {
        if (display) {
          swal({
            type: 'warning',
            title: `${jwRs.statusCode} - ${jwRs.body.title}`,
            text: `${jwRs.body.code} - ${jwRs.body.message}`,
            showCancelButton: false,
            confirmButtonColor: '#616161',
            confirmButtonText: 'Aceptar'
          });
        } else {
          this.alert = {
            active: true,
            animated: 'zoomIn',
            type: 'alert-warning',
            icon: 'ion-ios-close-outline',
            title: `Error: ${jwRs.statusCode} - ${jwRs.body.code}`,
            message: jwRs.body.message
          };
        }
      } else if (jwRs.statusCode === 404) {
        if(display) {
          swal({
            type: 'warning',
            title: `${jwRs.statusCode} - ${jwRs.body.title}`,
            text: `${jwRs.body.message}`,
            showCancelButton: false,
            confirmButtonColor: '#616161',
            confirmButtonText: 'Aceptar'
          });
        } else {
          this.alert = {
            active: true,
            animated: 'zoomIn',
            type: 'alert-warning',
            icon: 'ion-ios-close-outline',
            title: `Error: ${jwRs.statusCode} - ${jwRs.body}`,
            message: jwRs.body.data
          };
        }
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
      // Activar Selección
      let selectActive = false;
      // Contador
      let cont = 0;
      // Cuenta la cantidad de repeticiones
      let verifica = 0;

      // Verificando Variable de selección
      if (typeof(x) === 'string') {
        // Evaluación de pantalla
        for (cont; cont < this.listData.length; cont++) {
          if (x === 'a') {
            verifica = !this.listData[cont].check ? verifica + 1 : verifica;
            console.log(verifica)
            if (verifica === 0 && cont === (this.listData.length - 1)) {
              selectActive = false;
              iziToast.error({
                title: 'Ok! Ya todo está seleccionado.',
                position: 'bottomCenter'
              });
            }else{
              selectActive = true;
            }
          } else if (x === 'z') {
            verifica = this.listData[cont].check ? verifica + 1 : verifica;
            if (verifica === 0 && cont === (this.listData.length - 1)) {
              selectActive = false;
              iziToast.error({
                title: 'Error! No hay nada Seleccionado.',
                position: 'bottomCenter'
              });
            } else {
              selectActive = true;
            }
          } else if (x === 'c') {
            selectActive = true;
          }
        }

        // Se activa la selección
        if (selectActive) {
          // llama la lista y los va seleccionando 1 por 1
          if (x === 'a' ) {
            for (let d of this.listData) {
              d.check = true;
            }
            iziToast.success({
              title: 'Se ha seleccionado todo.',
              position: 'bottomCenter'
            });
          }
          // Deseleccionar todo
          else if (x === 'z') {
            for (let d of this.listData) {
              d.check = false;
            }
            iziToast.success({
              title: 'Se ha deseleccionado todo.',
              position: 'bottomCenter'
            });
          }
          // invertir selección
          else if (x === 'c') {
            for (let d of this.listData) {
              if (!d.check) {
                d.check = true;
              } else {
                d.check = false;
              }
            }
            iziToast.success({
              title: 'Se ha Invertido la Selección.',
              position: 'bottomCenter'
            });
          }
          selectActive = false;
          verifica = 0;
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
     * searchAnimated
     * @description :: Crea una animación para la alerta cuando no hay
     * resultados esperados, puede cerrar o abrir la alerta con la animación
     * @param {Boolean} act :: Activa o desactiva la animación
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
      this.changeEmail = {newEmail :'',confirmNewEmail :'',error:'',errorText:''}; // Limpia los Datos
      this.changePassword = {}; // Limpia los datos
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
     * @description :: hace que el usuario confirme que se va actualizar los datos
     * mostrando una ventana emergente.
     * @param {string} id :: identificación del usuario en la base de datos.
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    btnUpdateUser: async function (id) {
      swal({
        type: 'warning',
        title: '¿Actualizar Datos?',
        text: `Confirme si desea Actualizar los datos del usuario: ${this.userData.name}`,
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonColor: '#616161',
        confirmButtonText: 'Actualizar'
      }).then((r) => {
        if (r.value) {
          // Ejecuta el Actualizador de Datos
          this.updateUserData(id);
        }
      });
    },


    /**
     * updateUserData
     * @description :: Enviara los datos del usuario para ser actualizados en la base de datos
     * @param {string} id Del usuario que se va actualizar los datos
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    updateUserData: async function (id) {
      let csrfToken = window.SAILS_LOCALS._csrf;
      let urls = '/api/v2/users/update-data-user';
      this.updateProgress = true;

      // request list update user
      await io.socket.request({
        url: urls,
        method: 'patch',
        data: {
          id: id,
          role: this.userData.role,
          name: this.userData.name,
          lastName: this.userData.lastName,
          superAdmin: this.userData.isSuperAdmin,
          emailAddress: this.userData.emailAddress,
          emailStatus: this.userData.emailStatus,
          phone: this.userData.phone,
          status: this.userData.status
        },
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': csrfToken
        }
      }, (rsData, jwRs) => {
        this.updateProgress = false;
        // En caso de error
        if (jwRs.error) {
          this.jwRsError(jwRs, true);
        }

        if (jwRs.statusCode === 200) {
          swal({
            type: 'success',
            title: 'Actualización Correcta',
            text: `Se ha actualizado de manera correcta el Usuario.`,
            showCancelButton: false,
            confirmButtonColor: '#616161',
            confirmButtonText: 'Ok'
          }).then((r) => {
            if (r.value) {
              // Ejecuta el Actualizador de Datos
              // Me muestra en pantalla la actualización
              this.findOneUserView(id);

              // Actualización de pagina en caso de que sea el mismo
              if (window.SAILS_LOCALS.me.id === id) {
                window.location.reload();
              }
            }
          });

          // Actualiza los datos en la lista de la pantalla
          this.dataDb();
        }
      });
    },


    /**
     * onChangeAvatar
     * @description ::  Guardas los datos del archivo en la variable
     * para que el Method: updatechangeAvatar lo use
     * @param {array} evt Eventos de que ocurren
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    onChangeAvatar: async function (evt) {
      let file = evt.target.files[0];
      this.updateAvatar.avatarFile = file;
      this.updateAvatar.uploadBtn = false;
    },


    /**
     * updateChangeAvatar
     * @description :: Actualiza la imagen avatar de un usuario en concreto
     * mamipulandolo desde el administrador
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    updateChangeAvatar: async function () {
      let csrfToken = window.SAILS_LOCALS._csrf;
      let urls = '/api/v2/users/update-avatar';
      let formD = new FormData();

      // Headers


      // Deshabilito el Boton de Upload
      this.updateAvatar.uploadBtn = true;
      // active progress
      this.updateProgress = true;
      // Se crean los datos para enviar
      formD.append('uid', this.userData.id);
      formD.append('type', this.updateAvatar.avatarFile.type);
      formD.append('nameFile', this.updateAvatar.avatarFile.name);
      formD.append('sizeFile', this.updateAvatar.avatarFile.size);
      formD.append('avatar', this.updateAvatar.avatarFile);

      // Si el archivo no corresponde a una imagen
      if (!(/\.(jpg|png|gif)$/i).test(this.updateAvatar.avatarFile.name)) {
        swal({
          type: 'error',
          title: 'Arhivo no Compatible',
          text: `El archivo de nombre: ${this.updateAvatar.avatarFile.name}
          No es una IMAGEN.
          Corríjalo y vuelva a intentarlo.`,
        });
      } else {

        // Envia la información por Axios/Ajax
        axios.patch(
          urls,
          formD,
          {
            headers: {
              'content-type': 'application/json',
              'x-csrf-token': csrfToken
            }
          })
          .then(response => {
            return response;
          })
          .then(respons => {
            let dat = respons.data;
            // ocultar el progres
            this.updateProgress = false;

            // En caso de que el usuario coincida con la del mismo
            // Perfil del usuario
            if (this.me.id === this.userData.id) {
              swal({
                type: 'success',
                title: 'Avatar Actualizado',
                text: `Mi Avatar se actualizo con Exito`,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
                  location.reload();
                }
              });
            } else {
              swal({
                type: 'success',
                title: 'Avatar Actualizado',
                text: `Se ha actualizado el Avatar de: ${this.userData.name}`,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
                  // Reabro el modal de vista en modo view
                  this.findOneUserView(dat.aid);
                }
              });
            }
          })
          .catch(err => {
            // ocultar el progres
            this.updateProgress = false;
            let data = err.response.data;
            swal({
              type: 'error',
              title: 'Error al Subir',
              text: data.message
            });
            console.error('Fail Upload Avatar');
          });

        // Reset data input file
        this.updateAvatar.avatarFile = '';
      }
    },


    /**
     * toUnlockUser
     * @description ::
     * @param {string} id Del usuario que se va actualizar los datos
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    toUnlockUser: async function (id, status) {
      let csrfToken = window.SAILS_LOCALS._csrf;
      let urls = '/api/v2/users/update-unblock';
      let title = `¿Deseas ${status === 'B' ? 'Desbloquear':'Bloquear'} Usuario?`;
      let text = `Este usuario se encuentra ${status === 'B' ? 'Bloqueado':'Desbloqueado'}, en realidad quieres ${status === 'B' ? 'Desbloquear':'Bloquear'} hasta que cambie su contraseña.`;
      let btnConfirm = `${status === 'B' ? 'Desbloquear':'Bloquear'}`;

      // Uso normal, cuando este este en estado "B" o "E"
      if (status === 'B' || status === 'E') {
        swal({
          type: 'warning',
          title: title,
          text: text,
          confirmButtonColor: 'red',
          showCancelButton: true,
          cancelButtonColor: 'grey',
          confirmButtonText: btnConfirm
        }).then(async e => {
          if (e.value) {
            // Request change status
            await io.socket.request({
              url: urls,
              method: 'patch',
              data: {
                id: id,
                ed: btnConfirm
              },
              headers: {
                'content-type': 'application/json',
                'x-csrf-token': csrfToken
              }
            }, async (rsData, jwRs) => {
              // En caso de error
              if (jwRs.error) {
                this.jwRsError(jwRs, true);
              }

              if (jwRs.statusCode === 200) {
                swal({
                  type: 'success',
                  title: 'Procedimiento ejecutado correctamente',
                  text: rsData.text
                });
                // Reinicial la pantalla
                this.dataDb();
              }
            });
          }
        });
      }
      // Saco un aviso cuando no se puede usar esta opcion
      else {
        swal({
          type: 'info',
          title: 'No se puede usar esta función',
          text: 'Función no permitida debido a que no cumple con los parametros para ser usada',
        });
      }
    },


    /**
     * deleteUser
     * @description ::
     * @param {string} id Del usuario que se va actualizar los datos
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    deleteUser: async function (id) {
      let csrfToken = window.SAILS_LOCALS._csrf;
      let urls = '/api/v2/users/delete-users';

      swal({
        type: 'warning',
        title: '¿Eliminar usuario?',
        text: `Para eliminar este usuario presione DELETE`,
        confirmButtonColor: 'red',
        showCancelButton: true,
        cancelButtonColor: 'grey',
        confirmButtonText: 'DELETE'
      }).then(async (e) => {
        if (e.value) {
          // request list update user
          await io.socket.request({
            url: urls,
            method: 'DELETE',
            data: {
              id: id,
            },
            headers: {
              'content-type': 'application/json',
              'x-csrf-token': csrfToken
            }
          }, async (resData, jwRs) => {
            // En caso de error
            if (jwRs.error) {
              this.jwRsError(jwRs, true);
            }

            if (jwRs.statusCode === 200) {
              swal({
                type: 'success',
                title: 'Usuario eliminado',
                text: 'Se ha eliminado el usuario con exito'
              });

              // Reinicial la pantalla
              this.dataDb();
            }
          });
        }
      });
    },


    /**
     * updatedChangeEmail
     * @description Abre el modal para cambiar el correo electronico del usuario seleccionado
     * @param {String} id :: Id del usuario
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    btnUpdatedChangeEmail: async function (id) {
      // Busco el usario sin buscar en la base de datos
      for (let idx = 0; idx < this.listData.length; idx++) {
        let elx = this.listData[idx];
        if (elx.id === id) {
          this.userData = elx;
          // Finalizar loop
          idx = (this.listData.length + 9);
        }
      }

      this.changeEmail.id = id;
      this.changeEmail.newEmail = '';
      this.changeEmail.confirmNewEmail = '';
      this.changeEmail.error = '';
      this.changeEmail.errorText = '';

      // Avertencia con el nombre del usuarios
      swal({
        type: 'warning',
        title: `Cambiar Email a ${this.userData.name}`,
        text: `¿Estas seguro de que vas a cambiar el Correo Electronico? Si al usuario no se le avisa puede complicar el inicio de sesion del usuario o los usuarios.`,
        confirmButtonColor: 'red',
        showCancelButton: true,
        cancelButtonColor: 'grey',
        confirmButtonText: 'CAMBIAR EMAIL'
      }).then(async e => {
        if (e.value) {
          $(`#pm-view-change-email`).modal('show');
        }else{
          this.closeModalView(`pm-view-change-email`);
        }
      });
    },

    /**
     * updatedChangeEmail
     * @description envia el cambio a la base de datos para que sean acogidas
     * @param {string} id identificador de la base de datos del usuario
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    updatedChangeEmail: async function (id) {
      let csrfToken = window.SAILS_LOCALS._csrf;
      let urls = '/api/v2/users/update-change-email';
      let validateEmails = false;

      // Regex de email
      var valEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      // Validando emails
      if (!valEmail.test(this.changeEmail.newEmail) || !valEmail.test(this.changeEmail.confirmNewEmail)) {
        this.changeEmail.error = 'is-invalid';
        this.changeEmail.errorText = 'Escriba un correo electronico valido';
      } else {
        this.changeEmail.error = 'is-valid';
        this.changeEmail.errorText = '';
        validateEmails = true;
      }

      // Verificando que sean iguales los correos
      if (this.changeEmail.newEmail !== this.changeEmail.confirmNewEmail) {
        this.changeEmail.error = 'is-invalid';
        this.changeEmail.errorText = 'Los correos electronicos no coinciden. Verifique e intente de nuevo';
        validateEmails = false;
      } else {
        this.changeEmail.error = 'is-valid';
        this.changeEmail.errorText = '';
        validateEmails = true;
      }

      // send Request
      if (validateEmails) {
        this.updateProgress = true;
        await io.socket.request({
          url: urls,
          method: 'patch',
          data: {
            id: id,
            newEmail: this.changeEmail.newEmail,
            confirmNewEmail: this.changeEmail.confirmNewEmail
          },
          headers: {
            'content-type': 'application/json',
            'x-csrf-token': csrfToken
          }
        }, (rsData, jwRs) => {
          this.updateProgress = false;
          // En caso de error
          if (jwRs.error) {
            let disp = jwRs.statusCode === 400 ? true : false;
            // Cierra la ventana para visualizar el error
            if (jwRs.statusCode >= 401) {
              this.closeModalView(`pm-view-change-email`);
            }
            this.jwRsError(jwRs, disp);
          }

          // Todo ok
          if (jwRs.statusCode === 200) {
            swal({
              type: 'success',
              title: `Cambiar Email Exitoso`,
              text: `El cambio de email ha sucedido de manera correcta, verifique el correo electronico para confirmar el cambio`,
              showCancelButton: false,
              confirmButtonText: 'Terminar'
            }).then(async e => {
              if (e.value) {
                this.closeModalView(`pm-view-change-email`);
              }
            });
          }
        });
      }
    },


    /**
     * updatedChangePassword
     * @description cambia la contraseña de usuario
     * @param {String} id :: Id del usuario
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    btnUpdatedChangePassword: async function (id) {
      let csrfToken = window.SAILS_LOCALS._csrf;
      let urls = '/api/v2/users/update-change-password';
      // Busco el usario sin buscar en la base de datos
      for (let idx = 0; idx < this.listData.length; idx++) {
        let elx = this.listData[idx];
        if (elx.id === id) {
          this.userData = elx;
          // Finalizar loop
          idx = (this.listData.length + 9);
        }
      }


      // Avertencia con el nombre del usuarios
      swal({
        type: 'warning',
        title: `Bloquear y Cambiar Contraseña de: ${this.userData.name}`,
        text: `¿Estas seguro de que vas a cambiar el bloqueo y cambio de contraseña?
        Se enviara un Correo Electronico a ${this.userData.emailAddress} para cambiar
        su contraseña.`,
        confirmButtonColor: 'red',
        showCancelButton: true,
        cancelButtonColor: 'grey',
        confirmButtonText: 'CONTINUAR'
      }).then(async e => {
        if (e.value) {
          this.updateProgress = true;
          await io.socket.request({
            url: urls,
            method: 'patch',
            data: {
              id: id,
              newEmail: this.changeEmail.newEmail,
              confirmNewEmail: this.changeEmail.confirmNewEmail
            },
            headers: {
              'content-type': 'application/json',
              'x-csrf-token': csrfToken
            }
          }, (rsData, jwRs) => {
            this.updateProgress = false;
            // En caso de error
            if (jwRs.error) {
              let disp = jwRs.statusCode === 400 ? true : false;
              // Cierra la ventana para visualizar el error
              if (jwRs.statusCode >= 401) {
                this.closeModalView(`pm-view-change-email`);
              }
              this.jwRsError(jwRs, disp);
            }

            // Todo ok
            if (jwRs.statusCode === 200) {
              swal({
                type: 'success',
                title: `Procedimiento Exitoso`,
                text: `Se ha enviado el correo de cambio de contraseña y se ha bloqueado el usuario de manera exitosa.`,
                showCancelButton: false,
                confirmButtonText: 'Terminar'
              });
            }
          });
        }
      });
    },


    /**
     * updatedActiveAccount
     * @description Activa o desactiva la cuenta, para no acceder asi cambie de contraseña
     * @param {String} id :: Id del usuario
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    btnUpdatedActiveAccount:  async function (id) {
      swal({
        type: 'warning',
        title: 'Acción Usuario',
        text: `Esta acción aun no se ha terminado.`
      })
    },


    /**
     * updatedReconfirmEmail
     * @description reconfirma el correo electronico, crea una nueva fecha y un nuevo link
     * @param {String} id :: Id del usuario
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    btnUpdatedReconfirmEmail: async function (id) {
      let csrfToken = window.SAILS_LOCALS._csrf;
      let urls = '/api/v2/users/update-reconfirm-email';
      swal({
        type: 'warning',
        title: 'Acción Usuario',
        text: `Esta acción aun no se ha terminado.`
      })
    },

  }
});
