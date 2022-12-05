const { signup, login, logout, auth, authCode, refresh, mypage } = require('../controller/users');
const { isLoggedIn, isCookieIn } = require('../controller/middleware');

const express = require('express');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get("/auth", authCode);
router.post('/auth', auth);
router.get('/refresh', isCookieIn, refresh);
router.get('/mypage', isLoggedIn ,mypage);



module.exports = router;
