const billingmodel = require(`../models/index`).billings
const subscriptionmodel = require(`../models/index`).subscriptions
const servicemodel = require(`../models/index`).service_providers
const Op = require(`sequelize`).Op

exports.getallbillings = async (request, response) => {
    const user_id = request.user.id
    const role = request.user.role
    
    let queryOptions = { include: [{ model: subscriptionmodel, as: 'subscription' }] }

    if(role === 'CUSTOMER'){
        queryOptions.include[0].where = { user_id: user_id }
    }

    let billings = await billingmodel.findAll(queryOptions)
    return response.json({
        success: true,
        data: billings,
        message: `All billings have been loaded`
    })
}

exports.findbilling = async (request, response) => {
    let keyword = request.params.key
    const user_id = request.user.id
    const role = request.user.role

    let queryOptions = {
        where: {
            [Op.or]: [
                { id: { [Op.substring]: keyword } },
                { period_month: { [Op.substring]: keyword } },
                { period_year: { [Op.substring]: keyword } },
                { amount: { [Op.substring]: keyword } },
                { status: { [Op.substring]: keyword } }
            ]
        },
        include: [{ model: subscriptionmodel, as: 'subscription' }]
    }

    if(role === 'CUSTOMER'){
        queryOptions.include[0].where = { user_id: user_id }
    }

    let billings = await billingmodel.findAll(queryOptions)
    return response.json({
        success: true,
        data: billings,
        message: `Filtered billings have been loaded`
    })
}

exports.addbilling = async (request, response) => {
    try {
        const sub_id = request.body.sub_id
        const period_month = request.body.period_month
        const period_year = request.body.period_year

        // Cek duplikasi tagihan pada subscription dan periode yang sama
        let existBilling = await billingmodel.findOne({
            where: { sub_id: sub_id, period_month: period_month, period_year: period_year }
        })

        if (existBilling) {
            return response.json({
                success: false,
                message: `Billing for this subscription in this period already exists`
            })
        }

        let subscription = await subscriptionmodel.findByPk(sub_id)
        if (!subscription) {
            return response.json({
                success: false,
                message: `Subscription not found`
            })
        }

        let service = await servicemodel.findByPk(subscription.service_id)
        if (!service) {
            return response.json({
                success: false,
                message: `Service provider not found`
            })
        }

        let newbilling = {
            sub_id: sub_id,
            period_month: period_month,
            period_year: period_year,
            amount: service.price_per_month,
            due_date: request.body.due_date,
            status: "UNPAID"
        }

        let result = await billingmodel.create(newbilling)
        return response.json({
            success: true,
            data: result,
            message: `New billing has been created`
        })
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
}

exports.updatebilling = (request, response) => {
    let databilling = {
        sub_id: request.body.sub_id,
        period_month: request.body.period_month,
        period_year: request.body.period_year,
        amount: request.body.amount,
        due_date: request.body.due_date,
        status: request.body.status
    }
    let bil_id = request.params.id

    billingmodel.update(databilling, { where: { id: bil_id } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data billing has been updated`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

exports.deletebilling = (request, response) => {
    let bil_id = request.params.id

    billingmodel.destroy({ where: { bil_id: bil_id } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data billing has been deleted`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}