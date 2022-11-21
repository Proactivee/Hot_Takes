const express = require('express');
const router = express.Router();

const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth');
const sauceCtrl= require('../controllers/sauce');


router.get('/',auth, sauceCtrl.getAll);
router.post('/',auth,multer, sauceCtrl.upload);
router.get('/:id',auth,sauceCtrl.getOne);
router.put('/:id',auth,multer,sauceCtrl.modifySauce)
router.post('/:id/like',auth, sauceCtrl.likeOrNot)
router.delete('/:id',auth,sauceCtrl.deleteOne);


module.exports = router;