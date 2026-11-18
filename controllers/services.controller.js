/** load model for `users` table */				
const serviceModel = require(`../models/index`).service_providers

/** load Operation from  Sequelize  */
const Op = require(`sequelize`).Op

/** create function for read all data */
exports.getallservices = async (request, response) => {
    /** call findAll() to get all data */
    let services = await serviceModel.findAll()
    return response.json({
        success: true,
        data: services,
        message: `All services have been loaded`
    })
}

/** create function for filter */
exports.findservice = async (request, response) => {
    /** define keyword to find data */
    let keyword = request.params.key

    /** call findAll() within where clause and operation 
     * to find data based on keyword  */
    let services = await serviceModel.findAll({
        where: {
            [Op.or]: [
                { service_id: { [Op.substring]: keyword } },
                { name: { [Op.substring]: keyword } },
                { description: { [Op.substring]: keyword } },
                { speed: { [Op.substring]: keyword } },
                { price_per_month: { [Op.substring]: keyword } },
                { is_active: { [Op.substring]: keyword } }
            ]
        }
    })
    return response.json({
        success: true,
        data: users,
        message: `All Users have been loaded`
    })
}

/** create function for add new user */
exports.addservice = (request, response) => {
    /** prepare data from request */
    let newservice = {
        name: request.body.name,
        description: request.body.description,
        speed: request.body.speed,
        price_per_month: request.body.price_per_month,
        is_active: request.body.is_active
    }

    /** execute inserting data to service's table */
    serviceModel.create(newservice)

       .then(result => {
            /** if insert's process success */
            return response.json({
                success: true,
                data: result,
                message: `New service has been inserted`
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

/** create function for update service */
exports.updateservice = (request, response) => {
    /** prepare data that has been changed */
    let dataservice = {
        name: request.body.name,
        description: request.body.description,
        speed: request.body.speed,
        price_per_month: request.body.price_per_month,
        is_active: request.body.is_active
    }
    /** define id service that will be update */
    let service_id = request.params.id

    /** execute update data based on defined id service */
    serviceModel.update(dataservice, { where: { service_id : service_id } })
        .then(result => {
            /** if update's process success */
            return response.json({
                success: true,
                message: `Data service has been updated`
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
exports.deleteservice = (request, response) => {
    /** define id service that will be update */
    let service_id = request.params.id

    /** execute delete data based on defined id service */
    serviceModel.destroy({ where: { service_id: service_id } })
        .then(result => {
            /** if update's process success */
            return response.json({
                success: true,
                message: `Data service has been deleted`
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
