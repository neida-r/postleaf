'use strict';

// Node modules
const Path = require('path');
const HttpCodes = require('http-codes');

// Local modules
const AdminMenu = require(Path.join(__basedir, 'source/modules/admin_menu.js'));

module.exports = {

  //
  // Renders the edit user page.
  //
  view: (req, res, next) => {
    const I18n = req.app.locals.I18n;
    const User = req.User;
    const models = req.app.locals.Database.sequelize.models;
    let create = typeof req.params.id === 'undefined';

    // Fetch the user
    models.user
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then((user) => {
        if(!create && !user) {
          res.status(HttpCodes.NOT_FOUND);
          throw new Error('Page Not Found');
        }

        // Only the owner can edit the owner profile
        if(!create && user.role === 'owner' && User.role !== 'owner') {
          res.status(HttpCodes.UNAUTHORIZED);
          throw new Error('Unauthorized');
        }

        // Render the template
        res.useSystemViews().render('edit_user', {
          adminMenu: AdminMenu.getItems(req),
          meta: {
            bodyClass: 'edit-user',
            title: I18n.term(create ? 'new_user' : 'edit_user')
          },
          user: user,
          scripts: ['/assets/js/edit_user.bundle.js'],
          styles: ['/assets/css/edit_user.css']
        });
      })
      .catch((err) => next(err));
  }

};
