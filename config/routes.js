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

  /*
  '/':                  {controller: 'ViewPagesController', action: '', locals:{layout:'layouts/a'}},
  'wellcome':           {controller: 'ViewPagesController', action: '', locals:{layout:'layouts/a'}},
  'dashboard':          {controller: 'ViewPagesController', action: '', locals:{layout:'layouts/a'}},
 
  'faq':                {controller: 'ViewPagesController', action: '', locals:{layout:'layouts/a'}},
  'legal':              {controller: 'ViewPagesController', action: '', locals:{layout:'layouts/a'}},
  'legal/terminos':     {controller: 'ViewPagesController', action: '', locals:{layout:'layouts/a'}},
  'legal/privacidad':   {controller: 'ViewPagesController', action: '', locals:{layout:'layouts/a'}},
  'term':               {controller: 'ViewPagesController', action: '', locals:{layout:'layouts/a'}},
 
  'singup':             {controller: 'ViewPagesController', action: '', locals:{layout:'layouts/a'}},
  'email/confirm':      {controller: 'ViewPagesController', action: '', locals:{layout:'layouts/a'}},
  'email/confirmed':    {controller: 'ViewPagesController', action: '', locals:{layout:'layouts/a'}},
 
  'login':              {controller: 'ViewPagesController', action: '', locals:{layout:'layouts/a'}},
  'logout':             {controller: 'ViewPagesController', action: '', locals:{layout:'layouts/a'}},
  'password/forgot':    {controller: 'ViewPagesController', action: '', locals:{layout:'layouts/a'}},
  'password/new':       {controller: 'ViewPagesController', action: '', locals:{layout:'layouts/a'}},
 
  'acount':             {controller: 'ViewPagesController', action: '', locals:{layout:'layouts/a'}},
  'acount/password':    {controller: 'ViewPagesController', action: '', locals:{layout:'layouts/a'}},
  'acount/profile':     {controller: 'ViewPagesController', action: '', locals:{layout:'layouts/a'}},
  */

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
  

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
