const router = require('express').Router();
const { stockController } = require('../controller/stockController');
const { stockBody } = require('../utils/utils');


router.post('/createStock',stockBody, stockController);

module.exports = router;