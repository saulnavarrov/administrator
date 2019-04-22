/**
 * global-functions.js
 *
 * @description :: Mixins de datos de manera global y que se use
 *  en todos los modulos maestros.
 * @src {{proyect}}/assets/js/mixins/global-functions.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/04/20
 * @version 1.0
 */

//  ╔╗ ╔╗╦╔╗ ╔╗╦╔╗ ╦╔═╗  ╔═╗╦  ╔═╗╔═╗╔╦╗╔═╗
//  ║╚╦╝║║ ╠═╣ ║║╚╗║╚═╗  ║  ║  ╠═ ╠═╣ ║ ╠═
//  ╩   ╩╩╚╝ ╚╝╩╩ ╚╝╚═╝  ╚═╝╚═╝╚═╝╩ ╩ ╩ ╚═╝
var globalFunctions = {

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ╠═
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function data() {
    return {
      globalFunctions: 'Funciones Globales',

      modalProgress: {
        act: false,
        h1: ''
      }
    };
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠═ ╠═ ║  ╚╦╝║  ║  ╠═
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  created: function () {
    //…
  },
  beforeMount: function () {
    //…
  },
  mounted: async function () {
    //…

  },
  beforeDestroy: function () {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ╠═ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    /**
     * OpensModals
     * @description Abrira los modales en pantalla
     * @param {string} modal Nombre del modal que se va abrir en pantalla
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    OpensModals: async function (modal, title) {
      // Busca el modal con la Id enviada
      let modalFind = this.$find(`[id="pm-${modal}"]`);

      // Validando Title
      if (!_.isUndefined(title)) {
        this.modal.title = title;
      }

      // Abriendo modal
      modalFind.modal('show');
    },

    /**
     * CloseModals
     * @description Funcion para cerrar modales y resetear data
     * @param {string} modal Nombre del modal para cerrar
     * @author Saúl Navarrov <Sinavarrov@gmail.com>
     * @version 1.0
     */
    CloseModals: async function (modal) {
      // Busca el modal con la Id enviada
      if (!_.isUndefined(modal)){
        let modalFind = this.$find(`[id="pm-${modal}"]`);

        // Cerrando modal abierto
        modalFind.modal('hide');
      }

      // Cambiando variables
      this.modal.cerrar = 'Cerrar Ventana';
      this.modal.title = '';
      // Rest data
      this.resetDataMix();
    },


    /**
     *
     * @param {string} act actividad a desempeñar
     *  (show: para abrir | hide: para cerrar)
     * @param {string} h1 Titulo que tendra en pantalla
     */
    openCloseProgressData: async function (act, h1) {
      // Modo de uso
      if (!act) { throw new Error(`El argumento (act) es de uso ogligatorio`); }
      if (act !== 'show' && act !== 'hide') {throw new Error(`Solo se permiten pasar opciones (show & hide)`); }
      if (!h1) { throw new Error(`El argumento (h1) es de uso obligatorio.`); }

      // Poniendo titulo
      h1 !== 'clear' ? this.modalProgress.h1 = h1 : this.modalProgress.h1 = '';

      // Abiendo Modal de Progreso
      if (act === 'show') {
        console.log('Abiendo modal progress');
        this.modalProgress.act = true;
      }
      // Cerrando Modal de Progreso
      if (act === 'hide') {
        console.log('Cerrando modal progress');
        this.modalProgress.act = false;
      }
    },
  }
};
