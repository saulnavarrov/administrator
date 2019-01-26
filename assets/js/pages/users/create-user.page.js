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
    newUserCreate: {
      id: '',
      role: '',
      status: 'N',
      identification: '',
      name: '',
      lastName: '',
      isSuperAdmin: false,
      emailAddress: '',
      emailStatus: '',
      phone: '+57',
      lastSeenAt: '',
      updatedAt: '',
      createdAt: '',
      emailProofToken: '',
      tosAcceptedByIp: '',
      passwordResetToken: '',
      passwordResetTokenExpiresAt: '',
      emailProofTokenExpiresAt: '',
      emailChangeCandidate: '',
    },

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
    createNewUser: async function () {},


    /**
     * saveUserComplete
     * @description :: Para cuando el usuario se halla guardado de manera correcta
     *  mostrar un modal en pantalla de los datos que se generaron
     * @param {json} data :: Información del usuario para mostrar en pantalla.
     * @author Saúl Navarro <Sinavarrov@gmail.com>
     * @version 1.0
     */
    saveUserComplete: async function (data, reload) {},


    /**
     * existingData
     * @description :: Para los 3 principales datos si estan repetidos o ya existen
     * @param {json} data :: Datos a validar en pantalla
     * @param {boolean} isRepeat :: Valida si vienen datos a validar en patalla
     * @author Saúl Navarro <Sinavarrov@gmail.com>
     * @version 1.0
     */
    existingData: async function (data, isRepeat) {},


    /**
     * inCompleteData
     * @description :: Para cuando los datos sean incompletos los muestre en pantalla o borra el mensaje
     * @param {json} data :: Datos desde el servidor para validar en pantalla
     * @param {boolean} isIncomplete :: Valida si viene datos a validar en pantalla
     * @author Saúl Navarro <Sinavarrov@gmail.com>
     * @version 1.0
     */
    inCompleteData: async function (data, isIncomplete) {},


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
