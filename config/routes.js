/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'GET /':              {action:'view-pages/index', locals: {layout:'layouts/layout'}},

  // '/wellcome':           {action: '', locals:{layout:'layouts/a'}},
  '/dashboard':         {action: 'view-pages/dashboard', locals:{layout:'layouts/dashboard'}},
  // //---
  // '/faq':                {action: '', locals:{layout:'layouts/a'}},
  // '/legal':              {action: '', locals:{layout:'layouts/a'}},
  // '/legal/terminos':     {action: '', locals:{layout:'layouts/a'}},
  // '/legal/privacidad':   {action: '', locals:{layout:'layouts/a'}},
  // '/term':               {action: '', locals:{layout:'layouts/a'}},
  // //---
  'GET /singup':             {action: 'view-pages/register', locals:{layout:'layouts/login'}},
  // '/email/confirm':      {action: '', locals:{layout:'layouts/a'}},
  // '/email/confirmed':    {action: '', locals:{layout:'layouts/a'}},
  // //---
  'GET /login':              {action: 'view-pages/login', locals:{layout:'layouts/login'}},
  'GET /password/forgot':    {action: 'view-pages/forgot-password', locals:{layout:'layouts/login'}},
  'GET /password/new':       {action: 'view-pages/reset-password', locals:{layout:'layouts/login'}},
  // '/logout':             {action: '', locals:{layout:'layouts/a'}},
  // //---
  // '/acount':             {action: '', locals:{layout:'layouts/a'}},
  // '/acount/password':    {action: '', locals:{layout:'layouts/a'}},
  // '/acount/profile':     {action: '', locals:{layout:'layouts/a'}},

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  'POST /api/v1/login':              {action: 'auth/login'},

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝

  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝
};
