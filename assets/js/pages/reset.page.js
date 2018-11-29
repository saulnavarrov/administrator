parasails.registerPage('reset', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    formData: {
      passwordNew: '',
    },

    formErrors: {
      password: {
        valid: '',
        power: '',
        min: false,
        mayus: false,
        minus: false,
        numb: false,
      },
    },

    success: false,

    // Muestra si es fuerte la contraseña
    powerPassword: '',
    // Visualiza la contraseña de manera automaticas
    passwordPowerView: false,

    // Progress Modal
    updateProgressModal: false,

    sendChangePasswordModal: false
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…

    /**
     * sendChangePasswordUser
     */
    sendChangePasswordUser: async function () {
      let csrfToken = window.SAILS_LOCALS._csrf;
      let urls = `/api/v1/users/update-password-and-login`;
      let urlToken = location.search.substr(1);
      let pass = toString(this.formData.passwordNew);
      let urlJson = JSON.parse('{"' + decodeURI(urlToken).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"').replace(/\s/g, '') + '"}');

      if (this.formErrors.password.valid === 'is-invalid') {
        swal({
          title: 'Error en la contraseña',
          text: 'Por favor ingrese una contraseña valida, con al menos una mayuscula, una minuscula, un numero y 8 carapteres minimo',
          type: 'info'
        });
      } else if (pass.length < 8) {
        swal({
          title: 'Error en la contraseña',
          text: 'Por favor ingrese una contraseña valida, con al menos una mayuscula, una minuscula, un numero y 8 carapteres minimo',
          type: 'info'
        });
      } else {

        this.updateProgressModal = true;

        // Envio para guardar contaseña en la base de datos
        await io.socket.request({
          url: urls,
          method: 'PATCH',
          data: {
            password: this.formData.passwordNew,
            token: urlJson.token
          },
          headers: {
            'content-type': 'application/json',
            'x-csrf-token': csrfToken
          }
        }, (rsData, jsRes) => {
          this.updateProgressModal = false;

          if (jsRes.error) {
            swal({
              type: 'warning',
              title: 'Se presento un error',
              text: 'Error inesperado, por favor vuelva a intentarlo de nuevo, si el error persiste, comuniquese de inmediato con soporte.'
            });
          }

          if (jsRes.statusCode === 200) {
            this.success = true;
          }
        });
      }
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
      this.passwordPowerView = true;
      let sarr = new Array("abcdefghijkmnopqrstuvwxyz", "ABCDEFGHJKLMNOPQRSTUVWXYZ", "0123456789");
      let s = new String();
      let pw = new String();
      s = sarr[0] + sarr[1] + sarr[2];

      if(this.passwordPowerView && this.formData.passwordNew.length < 1) {
        $('#passeye-toggle-0').click();
      }

      // Genera el password con 12 caracteres
      for (let i = 0; i < 12; i++) {
        pw += s.charAt(Math.floor(Math.random() * s.length));
      }

      // pone el password en pantalla
      this.formData.passwordNew = pw;
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
      let passArray = _.toArray(this.formData.passwordNew);
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
          this.formErrors.password.minus = false;
        } else {
          this.formErrors.password.valid = 'is-invalid';
          this.formErrors.password.minus = true;
        }

        // Validando Mayusculas
        if (mayusc.reg.test(elm)) {
          mayusc.l = mayusc.l + 1;
          mayusc.valid = true;
          this.formErrors.password.mayus = false;
        } else {
          this.formErrors.password.valid = 'is-invalid';
          this.formErrors.password.mayus = true;
        }

        // Validando Numeros
        if (number.reg.test(elm)) {
          number.l = number.l + 1;
          number.valid = true;
          this.formErrors.password.numb = false;
        } else {
          this.formErrors.password.valid = 'is-invalid';
          this.formErrors.password.numb = true;
        }

        // Caracteres minimos
        if (min.l >= min.reg) {
          min.valid = true;
          this.formErrors.password.min = false;
        } else {
          this.formErrors.password.valid = 'is-invalid';
          this.formErrors.password.min = true;
        }

        // Suma Caracteres
        min.l = min.l + 1;
      });

      // Power Security Passwors Operation
      let operation = (min.l * 4) + ((min.l - mayusc.l) * 3) + ((min.l - minusc.l) * 3) + (number.l * 7) + ((min.l - min.reg) * 3);

      // // Evaluando cantidad para evitar numeros negativos
      // operation > 4 ? this.formNewUser.passwordPowerStyle.width = operation : this.formNewUser.passwordPowerStyle.width = 5;

      // // urlTokenando el poder de la contaseña
      if (operation > 52 && operation < 82) {
        this.formErrors.password.power = 'bg-warning';
        this.powerPassword = ' Poco Seguro ';
      } else if (operation > 81 && operation < 1000) {
        // this.formNewUser.passwordPowerStyle.width = 97;
        if (minusc.valid && mayusc.valid && number.valid && min.valid) {
          this.formErrors.password.power = 'bg-success';
          this.formErrors.password.valid = 'is-valid';
          this.powerPassword = ' Muy Seguro ';
        } else {
          this.formErrors.password.power = 'bg-warning';
          this.powerPassword = ' Poco Seguro ';
        }
      } else {
        this.powerPassword = ' No es Seguro ';
        this.formErrors.password.power = 'bg-danger';
      }
    },
  }
});
