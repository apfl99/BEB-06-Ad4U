const {list, main,detail} = require('../controller/client');
const express = require('express');
const router = express.Router();


router.get('/main', main);
router.get('/list', list);
router.get('/detail', detail);

module.exports = router;