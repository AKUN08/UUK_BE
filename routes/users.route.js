const express = require(`express`)

const app = express()

app.use(express.json())

const userController = require(`../controllers/users.controller`)
/** load function from auth-controller */

app.get("/",userController.getalluser)

app.get("/:key", userController.finduser)

app.post("/", userController.adduser)

app.post("/register", userController.register)

app.put("/:id", userController.updateuser)

app.delete("/:id", userController.deleteuser)

app.put("/reset/:id", userController.resetpassword)

module.exports = app
