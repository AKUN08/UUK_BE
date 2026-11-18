const serviceModel = require(`../models/index`).service_providers
const user =  require(`../models/index`).users
const Op = require(`sequelize`).Op

exports.getallservices = async (request, response) => {
    const role = request.user.role
    let condition = {}
    if(role === 'customer'){
        condition = { is_active: true }
    }

    let services = await serviceModel.findAll({ where: condition })
    return response.json({
        success: true,
        data: services,
        message: `All services have been loaded`
    })
} 

exports.findservice = async (request, response) => {
    let keyword = request.params.key
    const role = request.user.role
    
    let whereClause = {
        [Op.or]: [
            { id: { [Op.substring]: keyword } },
            { name: { [Op.substring]: keyword } },
            { description: { [Op.substring]: keyword } },
            { speed: { [Op.substring]: keyword } },
            { price_per_month: { [Op.substring]: keyword } }
        ]
    }

    if(role === 'CUSTOMER'){
        whereClause.is_active = true
    }

    let services = await serviceModel.findAll({ where: whereClause })
    return response.json({
        success: true,
        data: services,
        message: `Filtered services have been loaded`
    })
}

exports.addservice = (request, response) => {
    let newservice = {
        name: request.body.name,
        description: request.body.description,
        speed: request.body.speed,
        price_per_month: request.body.price_per_month,
        is_active: request.body.is_active
    }

    serviceModel.create(newservice)
       .then(result => {
            return response.json({
                success: true,
                data: result,
                message: `New service has been inserted`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

exports.updateservice = (request, response) => {
    let dataservice = {
        name: request.body.name,
        description: request.body.description,
        speed: request.body.speed,
        price_per_month: request.body.price_per_month,
        is_active: request.body.is_active
    }
    let service_id = request.params.id

    serviceModel.update(dataservice, { where: { id : service_id } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data service has been updated`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

exports.deleteservice = (request, response) => {
    let service_id = request.params.id

    serviceModel.destroy({ where: { id: service_id } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data service has been deleted`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}