/**
 * debugNavigations
 * @module Police
 * @description Registra todas las visitas hechas las paginas y guarda la informacion permitiendo un recorrido de todas ellas.
 * @author SaulNavarrov <Sinavarrov@gmail.com>
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
// requires
// const rps = require('request-promise');

// CONSTANTES
const l = require('./../../config/local');

// FUNCTIONS
/**
 * registerNavegations
 * @description Controlador de funciones del police
 * @param {*} opt Datos para Require y response
 * @author SaúlNavarrov <Sinavarrov@gmail.com>
 */
async function registerNavegations(opt) {
  let req = opt.req;
  let res = opt.res;

  // Usar en caso de que no encuentre el supuesto sesion
  // let ss = typeof (req.session) === 'undefined' ? true : false; // control de sesion
  // let guser = typeof (req.query.guser) === 'undefined' ? 'Guest' : req.query.guser; // Identifica el usuario que hace la solicitud con la url full

  let userId = typeof (req.session.userId) === 'undefined' ? 'Guest' : req.session.userId;
  // rr = {}, // Usarse para otra funcion e idientificar los paises de origen de Ip
  // nxe = true,
  // res = opt.res,

  let ip = req.headers['x-real-ip'] || req.ip;
  let datosReg = {
    'xforwarderfor': req.headers['x-forwarded-for'] || ip,
    'protocol': req.protocol,
    'xforwardedproto': req.headers['x-forwarded-proto'],
    'xrequeststart': req.headers['x-request-start'],
    'host': typeof (req.headers['host']) === 'undefined' ? req.headers['origin']: `${req.protocol}://${req.headers['host']}`,
    'url': req.url || l.baseUrl,
    'isSocket': req.isSocket || '',
    'method': req.method,
    'complete': req.complete,
    'opController': req.options['controller'],
    'opAction': req.options.action,
    'xnginxproxy': req.headers['x-nginx-proxy'],
    'connection': req.headers['connection'],
    'cacheControl': req.headers['cache-control'],
    'upgradeInsecureRequests': req.headers['upgrade-insecure-requests'],
    'userAgent': req.headers['user-agent'],
    'acceptEncoding': req.headers['accept-encoding'],
    'acceptLanguage': req.headers['accept-lenguage'] || req.i18n.locale,
    'locale': req.i18n.locale,
    'cookie': req.headers['cookie'],
    'dnt': req.headers['dnt'],
    'ifNoneMatch': req.headers['if-none-match'],
    'user': userId,
  };

  datosReg.ipsl = '';
  await saveDataLogsNavigations(datosReg);
}


/**
 * saveDataLogsNavigations
 * @description :: Guarda en la base de datos el logs de las Navegaciones
 * @param {Json} dat :: Datos que guardara
 * @author SaúlNavarrov <Sinavarrov@gmail.com>
 */
async function saveDataLogsNavigations(dat) {
  await DebugNavigations.create(dat).fetch();
}

// MODULE
module.exports = async function (req, res, proceed) {
  // Reenvio los datos para ejecutar en las funciones
  var options = {
    req: req,
    res: res
  };

  // Guarda el Registro de navegación.
  await registerNavegations(options);

  // Continue
  return proceed();
};
