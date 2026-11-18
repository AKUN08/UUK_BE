/** load model for `users` table */				
const subscriptionmodel = require(`../models/index`).subscriptions

/** load Operation from  Sequelize  */
const Op = require(`sequelize`).Op

/** create function for read all data */
exports.getallsubscriptions = async (request, response) => {
    /** call findAll() to get all data */
    let subscriptions = await subscriptionmodel.findAll()
    return response.json({
        success: true,
        data: subscriptions,
        message: `All subscriptions have been loaded`
    })
}

/** create function for filter */
exports.findsubscription = async (request, response) => {
    /** define keyword to find data */
    let keyword = request.params.key

    /** call findAll() within where clause and operation 
     * to find data based on keyword  */
    let subscriptions = await subscriptionmodel.findAll({
        where: {
            [Op.or]: [
                { sub_id: { [Op.substring]: keyword } },
                { users_id: { [Op.substring]: keyword } },
                { service_id: { [Op.substring]: keyword } },
                { status: { [Op.substring]: keyword } }
            ]
        }
    })
    return response.json({
        success: true,
        data: subscriptions,
        message: `All subscriptions have been loaded`
    })
}

/** create function for add new user */
exports.addsubscription = (request, response) => {
    /** prepare data from request */
    let newsubscription = {
        users_id: request.body.users_id,
        service_id: request.body.service_id,
        status: request.body.status
    }

    subscriptionmodel.create(newsubscription)

       .then(result => {
            /** if insert's process success */
            return response.json({
                success: true,
                data: result,
                message: `New subscription has been inserted`
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

/** create function for update subscription */
exports.updatesubscription = (request, response) => {
    /** prepare data that has been changed */
    let dataSubscription = {
        users_id: request.body.users_id,
        service_id: request.body.service_id,
        status: request.body.status
    }
    /** define id subscription that will be update */
    let sub_id = request.params.id

    /** execute update data based on defined id subscription */
    subscriptionmodel.update(dataSubscription, { where: { sub_id : sub_id } })
        .then(result => {
            /** if update's process success */
            return response.json({
                success: true,
                message: `Data subscription has been updated`
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
exports.deletesubscription = (request, response) => {
    /** define id subscription that will be update */
    let sub_id = request.params.id

    /** execute delete data based on defined id subscription */
    subscriptionmodel.destroy({ where: { sub_id: sub_id } })
        .then(result => {
            /** if delete's process success */
            return response.json({
                success: true,
                message: `Data subscription has been deleted`
            })
        })
        .catch(error => {
            /** if delete's process fail */
            return response.json({
                success: false,
                message: error.message
            })
        })
}
