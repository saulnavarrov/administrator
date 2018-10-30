parasails.registerPage('register-new-user', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    newUser: { // Datos del nuevo usuario
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
      }
    },

    valForm: { // Validación del formulario
      // Validacion de contraseña
      password: {
        valid: '',
        min: false,
        mayus: false,
        minus: false,
        numb: false,
      },

      identification: '',
      phone: '',
      emailAddress: '',
    },
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
    this.newUser.role = 1;
    this.newUser.identification = String(Date.now());
    this.newUser.name = 'saul';
    this.newUser.lastName = 'Pruebas';
    this.newUser.emailAddress = `prueba${String(Date.now()).substring(9)}@example.com`;
    this.newUser.emailStatus = 'unconfirmed';
    this.newUser.phone = `+57${String(Date.now())}`;
    // this.newUser.password = `Abc-${String(Date.now())}`;
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…


    /**
     * validatePassword
     * @description :: Validador de Contraseña para usuarios nuevos
     * @author Saúl Navarro <Sinavarrov@gmail.com>
     * @version 1.0
     */
    validatePassword: async function () {
      let minusc = {reg: /[a-z]{1}/, l: 0, valid: false};
      let mayusc = {reg: /[A-Z]{1}/, l: 0, valid: false};
      let number = {reg: /[0-9]{1}/, l: 0, valid: false};
      let min =    {reg: 7, l: 0, valid: false};
      let passArray = _.toArray(this.newUser.password);

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
      operation > 4 ? this.newUser.passwordPowerStyle.width = operation : this.newUser.passwordPowerStyle.width = 5;

      // Mostrando el poder de la contaseña
      if (operation > 52 && operation < 82) {
        this.newUser.passwordPower = 'bg-warning';
      } else if (operation > 81 && operation < 1000) {
        this.newUser.passwordPowerStyle.width = 97;
        if( minusc.valid && mayusc.valid && number.valid && min.valid ) {
          this.newUser.passwordPower = 'bg-success';
          this.valForm.password.valid = 'is-valid';
        }else{
          this.newUser.passwordPower = 'bg-warning';
        }
      } else {
        this.newUser.passwordPower = 'bg-danger';
      }

    }
  }
});
