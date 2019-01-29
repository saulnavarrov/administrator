parasails.registerPage('create-user', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    // Config Alert Display
    alert: {
      active: false,
      icon: 'ion-ios-information-outline',
      title: 'Titulo de la alerta',
      message: 'Mensaje de la alerta content',
      type: 'alert-info'
    },

    formNewUser: { // Datos del nuevo usuario
      role: '',
      status: 'N',
      identification: '',
      name: '',
      lastName: '',
      isSuperAdmin: false,
      emailAddress: '',
      emailStatus: '',
      phone: '+57',
      password: '',
      passwordPower: 'bg-danger', // Stados = bg-warning bg-danger bg-success
      passwordPowerStyle: {
        width: 5,
        password: false,
      }
    },

    // Datos del nuevo usuario
    newUserCreate: {},

    valForm: { // Validación del formulario
      password: { valid: '', min: false, mayus: false, minus: false, numb: false, },
      identification: { valid: '', message: 'Ingrese Numero de Identificación.' },
      emailAddress: { valid: '', message: 'Ingrese Email' },
      name: { valid: '', message: 'Ingrese el nombre del usuario' },
      lastName: { valid: '', message: 'Ingrese el apellido del usuario.' },
      phone: { valid: '', message: 'Ingrese Numero Telefonico' },
      role: { valid: '', message: 'Dato Incompleto.' },
      isSuperAdmin: { valid: '', message: 'Dato Incompleto.' },
      emailStatus: { valid: '', message: 'Dato Incompleto.' },
      status: { valid: '', message: 'Dato Incompleto.' },
    },

    updateProgress: false
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function () {
    //…

    swal({
      title: 'Borrar auto carga de datos',
      text: `Borrar las lineas de autocarga de datos que estan en situadas
      en el codigo para hacer las pruebas`,
      type: 'warning'
    });
    this.formNewUser.role = 1;
    this.formNewUser.identification = String(Date.now());
    this.formNewUser.name = 'saul';
    this.formNewUser.lastName = 'Pruebas';
    this.formNewUser.emailAddress = `prueba${String(Date.now()).substring(9)}@example.com`;
    this.formNewUser.emailStatus = 'unconfirmed';
    this.formNewUser.phone = `+57${String(Date.now())}`;
    this.generateNewPassword();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…

    /**
     * createNewUser
     * @description :: Enviara los datos para guardarlos
     * @author Saúl Navarro <Sinavarrov@gmail.com>
     * @version 1.0
     */
    createNewUser: async function () {
      let csrfToken = window.SAILS_LOCALS._csrf;
      let urls = '/api/v2/users/create';
      this.progressBar = true;
      this.updateProgress = true;

      await io.socket.request({
        url: urls,
        method: 'POST',
        data: {
          identification: this.formNewUser.identification,
          emailAddress: this.formNewUser.emailAddress,
          password: this.formNewUser.password,
          name: this.formNewUser.name,
          lastName: this.formNewUser.lastName,
          phone: this.formNewUser.phone,
          role: Number(this.formNewUser.role),
          isSuperAdmin: this.formNewUser.isSuperAdmin,
          emailStatus: this.formNewUser.emailStatus,
          status: this.formNewUser.status
        },
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': csrfToken
        }
      }, async (rsData, jsRs) => {
        console.log(jsRs);

        // Control de errores
        if (jsRs.error) {

          // Datos incompletos
          this.inCompleteData(rsData, _.isUndefined(rsData.form));

          // Datos repetidos
          this.existingData(rsData, _.isUndefined(rsData.message));

          // Problemas con el servidor
          // Errores 500
          if (jsRs.statusCode >= 500 && jsRs.statusCode <= 502) {
            this.alert = {
              active: true,
              type: 'alert-danger',
              icon: 'ion-ios-close-outline',
              title: `Error: ${jsRs.statusCode} - ${jsRs.body}`,
              message: jsRs.error.message
            };
          }
        }

        if (jsRs.statusCode === 200) {
          // Limpia el los campos en rojo
          this.inCompleteData(false, true);
          // Limpia los campos en rojo de validación
          this.existingData(false, true);

          // Mostrar modal del usuario nuevo
          this.saveUserComplete(rsData, false);
        }
        this.updateProgress = false;
      });
    },


    /**
     * saveUserComplete
     * @description :: Para cuando el usuario se halla guardado de manera correcta
     *  mostrar un modal en pantalla de los datos que se generaron
     * @param {json} data :: Información del usuario para mostrar en pantalla.
     * @author Saúl Navarro <Sinavarrov@gmail.com>
     * @version 1.0
     */
    saveUserComplete: async function (data, reload) {
      Swal.fire({
        title: 'Usuario Creado con Exito',
        text: `El usuario ${data.user.name +' '+ data.user.lastName}. Ha sido creado exitosamente.`,
        type: 'success',
        showCancelButton: true,
        confirmButtonColor: '#616161',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Lista Usuarios'
      }).then((result) => {
        if (result.value) {
          window.location.reload();
        }else{
          window.location.href = `${window.location.origin}/users`;
        }
      });
    },


    /**
     * existingData
     * @description :: Para los 3 principales datos si estan repetidos o ya existen
     * @param {json} data :: Datos a validar en pantalla
     * @param {boolean} isRepeat :: Valida si vienen datos a validar en patalla
     * @author Saúl Navarro <Sinavarrov@gmail.com>
     * @version 1.0
     */
    existingData: async function (data, isRepeat) {
      // Mostrar campo en rojo de invalido
      if (!isRepeat) {
        swal({
          type: 'warning',
          title: 'Los siguientes datos ya existen',
          text: 'Por favor, revise los campos en rojo, ya que existen para otro usuario'
        });

        // Pone el box en rojo
        this.valForm.emailAddress.valid = data.data.email === '' ? '' : data.data.email;
        this.valForm.identification.valid = data.data.identification === '' ? '' : data.data.identification;
        this.valForm.phone.valid = data.data.phone === '' ? '' : data.data.phone;

        // Mostrar mensaje
        this.valForm.emailAddress.message = data.message.email === '' ? '' : data.message.email;
        this.valForm.identification.message = data.message.identification === '' ? '' : data.message.identification;
        this.valForm.phone.message = data.message.phone === '' ? '' : data.message.phone;
      }
      // Rest data
      else {
        this.valForm.emailAddress.valid = '';
        this.valForm.identification.valid = '';
        this.valForm.phone.valid = '';
        this.valForm.emailAddress.message = 'Ingrese Email';
        this.valForm.identification.message = 'Ingrese Numero de Identificación';
        this.valForm.phone.message = 'Ingrese Numero Telefonico';
      }
    },


    /**
     * inCompleteData
     * @description :: Para cuando los datos sean incompletos los muestre en pantalla o borra el mensaje
     * @param {json} data :: Datos desde el servidor para validar en pantalla
     * @param {boolean} isIncomplete :: Valida si viene datos a validar en pantalla
     * @author Saúl Navarro <Sinavarrov@gmail.com>
     * @version 1.0
     */
    inCompleteData: async function (data, isIncomplete) {
      if (!isIncomplete) {
        swal({
          type: 'info',
          title: 'Datos incompletos',
          text: 'Por favor, rellene los campos que estan en rojo'
        });
      }
      this.valForm.identification.valid = isIncomplete ? '' : data.form.identification === '' ? '' : data.form.identification;
      this.valForm.emailAddress.valid = isIncomplete ? '' : data.form.emailAddress === '' ? '' : data.form.emailAddress;
      this.valForm.password.valid = isIncomplete ? '' : data.form.password === '' ? '' : data.form.password;
      this.valForm.name.valid = isIncomplete ? '' : data.form.name === '' ? '' : data.form.name;
      this.valForm.lastName.valid = isIncomplete ? '' : data.form.lastName === '' ? '' : data.form.lastName;
      this.valForm.phone.valid = isIncomplete ? '' : data.form.phone === '' ? '' : data.form.phone;
      this.valForm.role.valid = isIncomplete ? '' : data.form.role === '' ? '' : data.form.role;
      this.valForm.emailStatus.valid = isIncomplete ? '' : data.form.emailStatus === '' ? '' : data.form.emailStatus;
      this.valForm.status.valid = isIncomplete ? '' : data.form.status === '' ? '' : data.form.status;
    },


    /**
     * generateNewPassword
     * @description :: Genera una nueva contraseña con valores aleatorios entre mayusculas minusculas
     *  y numeros de 12 caracteres, a su vez lo envia a evaluar que tan fuerte es.
     *  Tambien desoculta la caja de la contraseña para poder verla.
     * @author Saúl Navarro <Sinavarrov@gmail.com>
     * @version 1.0
     */
    generateNewPassword: async function () {
      // Genera una contraseña apartir Aleatoria
      this.formNewUser.passwordPowerStyle.password = true;
      let sarr = new Array("abcdefghijkmnopqrstuvwxyz", "ABCDEFGHJKLMNOPQRSTUVWXYZ", "0123456789");
      let s = new String();
      let pw = new String();
      s = sarr[0] + sarr[1] + sarr[2];

      // Genera el password con 12 caracteres
      for (let i = 0; i < 12; i++) {
        pw += s.charAt(Math.floor(Math.random() * s.length));
      }

      // pone el password en pantalla
      this.formNewUser.password = pw;
      // Valida el passwor una vez generado
      this.validatePassword();
    },


    /**
     * validatePassword
     * @description :: Validador de Contraseña para usuarios nuevos
     * @author Saúl Navarro <Sinavarrov@gmail.com>
     * @version 1.0
     */
    validatePassword: async function () {
      let passArray = _.toArray(this.formNewUser.password);
      let minusc = {reg: /[a-z]{1}/, l: 0, valid: false};
      let mayusc = {reg: /[A-Z]{1}/, l: 0, valid: false};
      let number = {reg: /[0-9]{1}/, l: 0, valid: false};
      let min =    {reg: 7, l: 0, valid: false};

      // Recorriendo data
      passArray.forEach((elm) => {
        // Validando minusculas
        if (minusc.reg.test(elm)) {
          minusc.l = minusc.l + 1;
          minusc.valid = true;
          this.valForm.password.minus = false;
        } else {
          this.valForm.password.valid = 'is-invalid';
          this.valForm.password.minus = true;
        }

        // Validando Mayusculas
        if (mayusc.reg.test(elm)) {
          mayusc.l = mayusc.l + 1;
          mayusc.valid = true;
          this.valForm.password.mayus = false;
        } else {
          this.valForm.password.valid = 'is-invalid';
          this.valForm.password.mayus = true;
        }

        // Validando Numeros
        if (number.reg.test(elm)) {
          number.l = number.l + 1;
          number.valid = true;
          this.valForm.password.numb = false;
        } else {
          this.valForm.password.valid = 'is-invalid';
          this.valForm.password.numb = true;
        }

        // Caracteres minimos
        if (min.l >= min.reg) {
          min.valid = true;
          this.valForm.password.min = false;
        } else {
          this.valForm.password.valid = 'is-invalid';
          this.valForm.password.min = true;
        }

        // Suma Caracteres
        min.l = min.l + 1;
      });

      // Power Security Passwors Operation
      let operation = (min.l * 4) + ((min.l - mayusc.l) * 3) + ((min.l - minusc.l) * 3) + (number.l * 7) + ((min.l - min.reg) * 3);

      // Evaluando cantidad para evitar numeros negativos
      operation > 4 ? this.formNewUser.passwordPowerStyle.width = operation : this.formNewUser.passwordPowerStyle.width = 5;

      // Mostrando el poder de la contaseña
      if (operation > 52 && operation < 82) {
        this.formNewUser.passwordPower = 'bg-warning';
      } else if (operation > 81 && operation < 1000) {
        this.formNewUser.passwordPowerStyle.width = 97;
        if (minusc.valid && mayusc.valid && number.valid && min.valid) {
          this.formNewUser.passwordPower = 'bg-success';
          this.valForm.password.valid = 'is-valid';
        } else {
          this.formNewUser.passwordPower = 'bg-warning';
        }
      } else {
        this.formNewUser.passwordPower = 'bg-danger';
      }
    },


    /**
     * deletePassword
     * @description :: Elimina la contraseña en la caja, y la oculta
     * @author Saúl Navarro <Sinavarrov@gmail.com>
     * @version 1.0
     */
    deletePassword: async function () {
      // Solo si Este Contenido puede borrarlo
      if (this.formNewUser.password !== '') {
        swal({
          type: 'warning',
          title: '¿Borrando contraseña?',
          text: 'Borraras la contraseña generada',
          confirmButtonText: 'Aceptar',
          showCancelButton: true,
          cancelButtonColor: '#d33',
          confirmButtonColor: '#616161',
        }).then((result) => {
          if (result.value) {
            // Ejecuta el Actualizador de Datos
            this.formNewUser.password = '';
            this.valForm.password.valid = 'is-invalid';
            this.formNewUser.passwordPowerStyle.password = false;
            this.validatePassword();
            swal({
              type: 'success',
              title: 'Contraseña Borrada',
              text: 'Sé ha borrado la contraseña exitosamente. Y puedes generar otra.'
            });
          }
        });
      }
    },
  }
});
