const express = require(`express`)

const app = express()

app.use(express.json())

const subsController = require(`../controllers/subs.controller`)
/** load function from auth-controller */

app.get("/",subsController.getallsubscriptions)

app.get("/:key", subsController.findsubscription)

app.post("/", subsController.addsubscription)

app.put("/:id", subsController.updatesubscription)

app.delete("/:id", subsController.deletesubscription)

module.exports = app
