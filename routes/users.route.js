const express = require(`express`)

const app = express()

app.use(express.json())

const userController = require(`../controllers/users.controller`)

const {IsCustomer, IsAdmin} = require('../middlewares/role_validation')

app.get("/", userController.getalluser)

app.get("/:key",IsAdmin, userController.finduser)

app.post("/",IsAdmin, userController.adduser)

app.post("/register", userController.register)

app.put("/:id",IsAdmin, userController.updateuser)

app.delete("/:id",IsAdmin, userController.deleteuser)

app.put("/reset/:id", userController.resetpassword)

module.exports = app
