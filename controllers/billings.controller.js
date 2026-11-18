/** load model for `users` table */				
const billingmodel = require(`../models/index`).billings

/** load Operation from  Sequelize  */
const Op = require(`sequelize`).Op

/** create function for read all data */
exports.getallbillings = async (request, response) => {
    /** call findAll() to get all data */
    let billings = await billingmodel.findAll()
    return response.json({
        success: true,
        data: billings,
        message: `All billings have been loaded`
    })
}

/** create function for filter */
exports.findbilling = async (request, response) => {
    /** define keyword to find data */
    let keyword = request.params.key

    /** call findAll() within where clause and operation 
     * to find data based on keyword  */
    let billings = await billingmodel.findAll({
        where: {
            [Op.or]: [
                { sub_id: { [Op.substring]: keyword } },
                { period_month: { [Op.substring]: keyword } },
                { period_year: { [Op.substring]: keyword } },
                { amount: { [Op.substring]: keyword } },
                { due_date: { [Op.substring]: keyword } },
                { status: { [Op.substring]: keyword } }
            ]
        }
    })
    return response.json({
        success: true,
        data: billings,
        message: `All billings have been loaded`
    })
}

/** create function for add new billing */
exports.addbilling = (request, response) => {
    /** prepare data from request */
    let newbilling = {
        sub_id: request.body.sub_id,
        period_month: request.body.period_month,
        period_year: request.body.period_year,
        amount: request.body.amount,
        due_date: request.body.due_date,
        status: request.body.status
    }

    /** execute inserting data to billing's table */
    billingmodel.create(newbilling)

       .then(result => {
            /** if insert's process success */
            return response.json({
                success: true,
                data: result,
                message: `New billing has been inserted`
            })
        })
        .catch(error => {
            /** if insert's process fail */
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** create function for update billing */
exports.updatebilling = (request, response) => {
    /** prepare data that has been changed */
    let databilling = {
        sub_id: request.body.sub_id,
        period_month: request.body.period_month,
        period_year: request.body.period_year,
        amount: request.body.amount,
        due_date: request.body.due_date,
        status: request.body.status
    }
    /** define id billing that will be update */
    let bil_id = request.params.id

    /** execute update data based on defined id billing */
    billingmodel.update(databilling, { where: { bil_id : bil_id } })
        .then(result => {
            /** if update's process success */
            return response.json({
                success: true,
                message: `Data billing has been updated`
            })
        })
        .catch(error => {
            /** if update's process fail */
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** create function for delete data  */
exports.deletebilling = (request, response) => {
    /** define id billing that will be update */
    let bil_id = request.params.id

    /** execute delete data based on defined id billing */
    billingmodel.destroy({ where: { bil_id: bil_id } })
        .then(result => {
            /** if update's process success */
            return response.json({
                success: true,
                message: `Data billing has been deleted`
            })
        })
        .catch(error => {
            /** if update's process fail */
            return response.json({
                success: false,
                message: error.message
            })
        })
}
