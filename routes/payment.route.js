const express = require(`express`)

const app = express()

app.use(express.json())

const paymentController = require(`../controllers/payments.controller`)
const { authorize } = require('../controllers/auth.controller')

/** load function from role-validation */
const {IsCustomer, IsAdmin} = require('../middlewares/role_validation')

/** load function from auth-controller */

app.get("/",authorize,paymentController.getallpayment)

app.get("/:key",authorize,paymentController.findpayment)

app.post("/", authorize, paymentController.addpayment)

app.put("/:pay_id", authorize, IsAdmin,paymentController.updatepayment)

app.delete("/:pay_id", authorize, paymentController.deletepayment)


module.exports = app
