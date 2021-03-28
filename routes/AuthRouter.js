const express=require("express")
const { registerView, registerUser, loginView, loginUser, LogOut } = require("../controllers/AuthController")
const { validateRegister, checkEmailUnique,validateLogin } = require("../middlewares/validator")
const passport=require("passport")

const router=express.Router()

router.route("/register")
.get(registerView)
.post( validateRegister, checkEmailUnique, registerUser)

router.route("/login")
.get(loginView)
.post( validateLogin, loginUser)

router.route("/logOut/:id")
.get(LogOut)


module.exports=router