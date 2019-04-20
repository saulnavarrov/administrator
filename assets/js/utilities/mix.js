var miPrimerMix = {
  data: {
    inicio: 'Data del Mix, ejecutada desde afuera'
  },
  created: function () {
    console.log('mix creado');
  },
  mounted: async function () {
    this.hello();
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
      this.oneViewCompany('5c662da6fc4d830ca1107318');
    },
    saludos: function () {
      console.log('Esta llamada fue desde el exterior de la applicacion');
    }
  }
};
