const express = require(`express`)

const app = express()

app.use(express.json())

const subsController = require(`../controllers/subs.controller`)
/** load function from auth-controller */
const { authorize } = require('../controllers/auth.controller')

/** load function from role-validation */
const {IsCustomer, IsAdmin} = require('../middlewares/role_validation')

app.get("/",authorize, subsController.getallsubscriptions)

app.get("/:key",authorize,subsController.findsubscription)

app.post("/",authorize, subsController.addsubscription)
    
app.put("/:id",authorize, subsController.updatesubscription)

app.delete("/:id", authorize, subsController.deletesubscription)

module.exports = app
