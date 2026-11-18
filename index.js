const express = require(`express`)

const app = express()

const PORT = 8000

const cors = require(`cors`)

app.use(cors())

const usersRoute = require(`./routes/users.route`)
const subsRoute = require(`./routes/subs.route`)
const servicesRoute = require('./routes/services.route')
const paymentRoute = require('./routes/payment.route')
const billingRoute = require('./routes/billing.route')
const authRoute = require(`./routes/auth.route`)

app.use(`/user`, usersRoute)
app.use(`/sub`, subsRoute)
app.use(`/service`, servicesRoute)
app.use(`/payment`, paymentRoute)
app.use(`/billing`, billingRoute)
app.use(`/auth`, authRoute)


app.listen(PORT, () => {
    console.log(`Server of Ticket Sales runs on port ${PORT}`)
})
app.use(express.static(__dirname))