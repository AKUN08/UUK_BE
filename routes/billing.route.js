const express = require(`express`)

const app = express()

app.use(express.json())

const billingsController = require(`../controllers/billings.controller`)
/** load function from auth-controller */

app.get("/",billingsController.getallbillings)

app.get("/:key", billingsController.findbilling)

app.post("/", billingsController.addbilling)

app.put("/:id", billingsController.updatebilling)

app.delete("/:id", billingsController.deletebilling)


module.exports = app
