const express = require(`express`)

const app = express()

app.use(express.json())

const serviceController = require(`../controllers/services.controller`)
/** load function from auth-controller */

app.get("/",serviceController.getallservices)

app.get("/:key", serviceController.findservice)

app.post("/", serviceController.addservice)

app.put("/:id", serviceController.updateservice)

app.delete("/:id", serviceController.deleteservice)


module.exports = app
