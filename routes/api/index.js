  const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/artists', require('./artists'));


module.exports = router;