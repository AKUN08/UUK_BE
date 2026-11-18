const express = require(`express`)

const app = express()

app.use(express.json())

const billingsController = require(`../controllers/billings.controller`)
const { authorize } = require('../controllers/auth.controller')

/** load function from role-validation */
const {IsCustomer, IsAdmin} = require('../middlewares/role_validation')

/** load function from auth-controller */

app.get("/",authorize,billingsController.getallbillings)

app.get("/:key",authorize, billingsController.findbilling)

app.post("/", authorize, billingsController.addbilling)

app.put("/:id", authorize, billingsController.updatebilling)

app.delete("/:id", authorize, billingsController.deletebilling)


module.exports = app
