parasails.registerPage('listUsers', {
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
    searchs: '', // Palabras de busquedas
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

    // Conexion con Socket.io Model
    // io.socket.on('users', msg =>{
    //   console.log(msg);
    //   //  console.log();
    // });
  },
  mounted: async function () {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    /**
     * dataDb
     * @description Esta funcion llama a la base de datos y trae 10 primeros
     * resultados, el usuario puede tambien cambiar la cantidad de resultados
     * y la paginacion que desea ver.
     * Cuenta con la opcion de buscador integrado.
     *
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    dataDb: async function () {
      let urls = '/api/v1/users';
      let csrfToken = window.SAILS_LOCALS._csrf;
      this.progressBar = true;

      // Control de urls find or findOne
      if (this.searching) {
        urls = '/api/v1/users/find-search';
      }

      // request list users
      await io.socket.request({
        url: urls,
        method: 'POST',
        data: {
          lim: this.limit,
          sk: this.skip,
          finds: this.searchs
        },
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': csrfToken
        }
      }, (resData, jwres) => {

        // En caso de error
        if (jwres.error) {
          this.jwresError(jwres);
        }

        if (jwres.statusCode === 200) {
          this.progressBar = false;
          this.tableData = this.search = this.footerTable = this.countData = true;
          this.listCount = resData.list.length;
          this.listData = resData.list;
          this.listFullCount = resData.count;
          if (resData.count > this.listCount) {
            this.navegationsData = this.numResult = true;
          }
          this.paginationCount();

          // cuando se realiza la busqueda
          if (this.searching && (this.listCount === 0)) {
            this.tableData = this.footerTable = false;
            this.alert.title = 'No hay Resultados';
            this.alert.message = `No se encontraron resultados para la busqueda: ${this.search}`;
            this.alert.active = true;
          }else{
            this.alert.active = false;
          }
        }
      });
    },


    /**
     * paginationCount
     * @description Configuracion y renderizacion de paginacion
     * para visualizarla en pantalla
     * @author SaulNavarrov <sinavarrov@gmail.com>
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
     * @description control de la paginacion, esta me permite
     * omitir una cantidad de datos el modificador es skip
     * @author SaulNavarrov <sinavarrov@gmail.com>
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
     * @description Calcula, cambia y activa la paginación minima, en caso
     * de que la paginación este en 10 y se cambie el limite de resultados
     * para que aparescan mas, esto selecciona en numero maximo que queda
     * y configura la pagianción para que se pueda ver.
     * fucniona con el limit y paginationCount
     * @author SaulNavarrov <sinavarrov@gmail.com>
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
     * @description Selecciona todos los datos que estan en pantalla
     * si hay uno seleccionado o varios y selecciona todos, este realiza
     * una seleccion inversa a los datos seleccionados manualmente.
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    selectAll: async function () {
      // llama la lista y los va seleccionando 1 por 1
      for (let d of this.listData) {
        // verifica el check que se crea desde el html
        // porque en la DB no viene.
        if (!d.check) {
          d.check = true;
        } else {
          d.check = false;
        }
      }
    },

    /**
     * findOne
     * @description Realiza una busqueda en la base de datos que coincidan
     * con lo escrito en pantalla
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    findOneSearch: async function () {

      // Reinicia el buscador
      if (!this.searching) {
        if(this.skip > 0){
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
      if (this.searching && this.searchs.length !== 0) {
        this.dataDb();
      } else {
        this.searching = false;
        this.alert.active = false;
        this.dataDb();
      }
    },

    /**
     * findEnd
     * @description Reinicia la busqueda y pone en pantalla
     * el listado original de datos sin busqueda
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    findEndSearch: async function () {
      if (this.searching && this.searchs.length > 0) {
        this.searchs = '';
        this.searching = false;
        this.alert.active = false;
        // Ejecicion del request
        this.dataDb();
      }else{
        // Blanqueando Caja
        this.searchs = '';
      }
    },

    /**
     * findOneUser
     * @description
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    findOneUserView: async function (id, title) {
      let csrfToken = window.SAILS_LOCALS._csrf;
      this.titleModal = 'Datos de: ';
      this.progressBar = true;
      let urls = '/api/v1/users/findOne';
      let modal = $('#pm-user-view');

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
        method: 'POST',
        data: {
          id: id
        },
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': csrfToken
        }
      }, (resData, jwres) => {

        // En caso de error
        if (jwres.error) {
          this.jwresError(jwres);
        }

        if (jwres.statusCode === 200) {
          // Desactiva el progrees
          this.progressBar = false;
          // carga los datos
          this.userData = resData.list;
          // pone el estado del modal en activo
          this.activeModal = true;

          // Eject Modal
          modal.modal('show');

        }
      });
    },

    /**
     * jwresError
     * @description alertas en pantalla en caso de haber un error
     * @param {json} jwres Datos del error
     */
    jwresError: async function (jwres) {
      this.progressBar = false;
      if (jwres.statusCode >= 500 && jwres.statusCode <= 502) {
        this.alert = {
          active: true,
          type: 'alert-danger',
          icon: 'ion-ios-close-outline',
          title: `Error: ${jwres.statusCode} - ${jwres.body}`,
          message: jwres.error.message
        };
      } else if (jwres.statusCode >= 400 && jwres.statusCode <= 499) {
        this.alert = {
          active: true,
          type: 'alert-warning',
          icon: 'ion-ios-close-outline',
          title: `Error: ${jwres.statusCode} - ${jwres.body}`,
          message: jwres.error.message
        };
      }
    },

    /**
     * findOneUserEdith
     * @description Habilita la edicion del usuario en la ventana del view
     * para mayor facilidad y trabajo
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    findOneUserEdit: async function (id) {
      // Verifica si el modal esta activo para ejecutar
      // el request
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
     * closeModalView
     * @description Cierra el modal que esta abierto y deja los estados
     * como active modal el false, y editTrueModal false
     * por si se abre el modal en modo vista no abra en modo edición
     * @param {string} modal titulo del modal
     * @author SaulNavarrov <sinavarrov@gmail.com>
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
     * btnUpdateUser
     * @description hace que el usuario confirme que se va actualizar los datos
     * mostrando una ventana emergente.
     * @param {string} id del usuario que se va acutalizar
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    btnUpdateUser: async function (id) {
      // // CODIGO VIEJO
      swal({
        type: 'warning',
        title: '¿Actualizar Datos?',
        text: `Confirme si desea Actualizar los datos del usuario: ${this.userData.name}`,
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonColor: '#616161',
        confirmButtonText: 'Actualizar'
      }).then((result) => {
        if (result.value) {
          // Ejecuta el Actualizador de Datos
          this.updateProgress = true;
          this.updateUserData(id);
        }
      });
    },

    /**
     * updateUserData
     * @description Enviara los datos del usuario para ser actualizados en la base de datos
     * @param {string} id Del usuario que se va actualizar los datos
     * @param {boolean} cnf Confirmación de la accion
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    updateUserData: async function (id) {
      let csrfToken = window.SAILS_LOCALS._csrf;
      let urls = '/api/v1/users/update-data-user';
      console.log('Actualizando datos del usuario: ');

      // request list update user
      await io.socket.request({
        url: urls,
        method: 'PATCH',
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
      }, (resData, jwres) => {

        this.updateProgress = false;
        // En caso de error
        if (jwres.error) {
          swal({
            type: 'error',
            title: 'Error al actualizar datos',
            text: `Se presento un error inesperado, intentelo nuevamente o
            consulte con el administrador del sistema`
          });
          console.log(jwres);
        }

        if (jwres.statusCode === 200) {
          console.log(resData);
          swal({
            type: 'success',
            title: 'Actualización Correcta',
            text: `Se ha actualizado de manera correcta el Usuario.`,
            confirmButtonText: 'Ok'
          });
          // Me muestra en pantalla la actualización
          this.findOneUserView(id);

          // Actualiza los datos en la lista de la pantalla
          this.listData.forEach((el,ix) => {
            if (el.id === id) {
              this.listData[ix].role = resData.user.role;
              this.listData[ix].roleName = resData.user.roleName;
              this.listData[ix].name = resData.user.name;
              this.listData[ix].lastName = resData.user.lastName;
              this.listData[ix].emailAddress = resData.user.emailAddress;
              this.listData[ix].emailStatus = resData.user.emailStatus;
            }
          });
        }
      });
    },

    /**
     * onChangeAvatar
     * @description Guardas los datos del archivo en la variable
     * para que el Method: updatechangeAvatar lo use
     * @param {array} evt Eventos de que ocurren
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    onChangeAvatar: async function (evt) {
      let file = evt.target.files[0];
      this.updateAvatar.avatarFile = file;
      this.updateAvatar.uploadBtn = false;
    },

    /**
     * updateChangeAvatar
     * @description Actualiza la imagen avatar de un usuario en concreto
     * mamipulandolo desde el administrador
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    updateChangeAvatar: async function () {
      let formD = new FormData();
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
        axios.patch('/api/v1/users/update-avatar', formD)
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
     * @description
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    toUnlockUser: async function (id) {
      console.log(`toUnlockUser: ${id}`);
    },

    /**
     * deleteUser
     * @description
     * @author SaulNavarrov <sinavarrov@gmail.com>
     * @version 1.0
     */
    deleteUser: async function (id) {
      console.log(`deleteUser: ${id}`);
      let csrfToken = window.SAILS_LOCALS._csrf;
      let urls = '/api/v1/users/delete-users';

      swal({
        type: 'warning',
        title: '¿Eliminar usuario?',
        text: `Para eliminar este usuario presione DELETE`,
        confirmButtonColor: 'red',
        showCancelButton: true,
        cancelButtonColor: 'grey',
        confirmButtonText: 'DELETE'
      }).then(async (e) => {
        if (e) {

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
          }, async (resData, jwRes) => {
            console.log(jwRes);

            if (jwRes.statusCode === 200) {
              swal({
                type: 'success',
                title: 'Usuario eliminado',
                text: 'Se ha eliminado el usuario con exito'
              });

              // Elimina el dato de la pantalla
              this.listData.forEach((el, ix) => {
                if (el.id === id) {
                  this.listData.splice(ix, 1);
                }
                if( this.listData.length === 0 ) {
                  this.tableData = false;
                  this.footerTable = false;
                  this.alert.active = true;
                  this.alert.title = 'No hay datos para mostrar';
                  this.alert.message = `Se han eliminado todos los usuarios seleccionados
                  y no hay datos para mostrar en pantalla. Reinicie la busqueda o la pagina
                  para visualizar mas usuarios.`;
                }
              });
            }
          });
        }
      });
    }
  }
});
