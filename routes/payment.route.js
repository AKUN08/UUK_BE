const express = require(`express`)

const app = express()

app.use(express.json())

const paymentController = require(`../controllers/payments.controller`)
/** load function from auth-controller */

app.get("/",paymentController.getallpayment)

app.get("/:key", paymentController.findpayment)

app.post("/", paymentController.addpayment)

app.put("/:id", paymentController.updatepayment)

app.delete("/:id", paymentController.deletepayment)


module.exports = app
