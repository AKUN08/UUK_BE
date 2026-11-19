const express = require(`express`)

const app = express()

app.use(express.json())

const serviceController = require(`../controllers/services.controller`)
const { authorize } = require('../controllers/auth.controller')

/** load function from role-validation */
const {IsCustomer, IsAdmin} = require('../middlewares/role_validation')

/** load function from auth-controller */

app.get("/",authorize,serviceController.getallservices)

app.get("/:key",authorize, serviceController.findservice)

app.post("/",authorize, IsAdmin, serviceController.addservice)

app.put("/:id",authorize, IsAdmin, serviceController.updateservice)

app.delete("/:id",authorize, IsAdmin, serviceController.deleteservice)


module.exports = app
