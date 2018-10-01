/**
 * debugNavigations
 *
 * @module      :: Police
 * @description :: Registra todas las visitas hechas las paginas y guarda la informacion permitiendo un recorrido de todas ellas.
 * @author      :: SaulNavarrov <Sinavarrov@gmail.com>
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
// requires
const rps = require('request-promise');

// FUNCTIONS
/**
 * registerNavegations
 * @description :: Controlador de funciones del police
 * @param {*} opt :: Datos para Require y response
 * @author :: SaúlNavarrov <Sinavarrov@gmail.com>
 */
async function registerNavegations(opt) {
  let req = opt.req,
        rr = {},
        nxe = true,
        res = opt.res,
        user = req.session.user,
        ip = req.headers["x-forwarded-for"],
        datosReg = {
        'xforwarderfor': req.headers["x-forwarded-for"] || '',
        'xrequestid': req.headers['x-request-id'] || '',
        'xforwardedproto': req.headers['x-forwarded-proto'] || '',
        'xrequeststart': req.headers['x-request-start'] || '',
        'host': req.headers['host'],
        'url': req.url,
        'method': req.method,
        'complete': req.complete,
        'opController': req.options['controller'],
        'opAction': req.options.action,
        'xnginxproxy': req.headers['x-nginx-proxy'] || '',
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
        'user': user === undefined ? 'Guest' : user.auth.id,
      };

  datosReg.ipsl = '';
  await saveDataLogsNavigations(datosReg);
}

// MODULE
module.exports = async function (req, res, proceed) {

  var options = {
    req: req,
    res: res
  };

  // Guarda el Registro de navegación.
  await registerNavegations(options);

  // Continue
  return proceed();
}