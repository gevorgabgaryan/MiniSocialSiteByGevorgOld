var express = require('express');
const { home ,deleteFriend, changePhoto, profile, updateUserDetails, getPrivateMessages} = require('../controllers/IndexController');
const passport=require("passport");
const { upload, resaizeImage } = require('../middlewares/upload');

var router = express.Router();

/* GET home page. */
router.get('/',passport.authenticate("jwt", {
    session: false,
    failureRedirect:"/auth/login"
}),home );

router.get('/profile/:id',  passport.authenticate("jwt", {session: false}),profile );

router.put('/profile/:id',  passport.authenticate("jwt", {session: false}),updateUserDetails )

router.post("/changePhoto",passport.authenticate("jwt", {session: false}),
upload,
resaizeImage ,
changePhoto
)

//private massages
router.post("/privatemessage",passport.authenticate("jwt", {session: false}),getPrivateMessages)


//delet frind

router.post('/deleteFriend/',deleteFriend)
module.exports = router;
