const homeRoutes = require('./home-routes.js');
const apiRoutes = require('./api/');
const router = require('express').Router();

router.use('/', homeRoutes);
router.use('/api', apiRoutes);

module.exports = router;