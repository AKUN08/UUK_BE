const subscriptionmodel = require(`../models/index`).subscriptions
const serviceModel = require(`../models/index`).service_providers
const Op = require(`sequelize`).Op

exports.getallsubscriptions = async (request, response) => {
    const users_id = request.user.users_id
    const role = request.user.role
    
    let condition = {}
    if(role === 'customer'){
        condition = {users_id: users_id}
    }

    let subscriptions = await subscriptionmodel.findAll({ 
        where: condition,
        include: [`user`, `service_providers`]
    })

    return response.json({
        success: true,
        data: subscriptions,
        message: `All subscriptions have been loaded`
    })
} 

exports.findsubscription = async (request, response) => {
    let keyword = request.params.key
    // PERBAIKAN: Gunakan request.user (bukan request.users)
    const users_id = request.users.id
    const role = request.user.role

    let whereClause = {
        [Op.or]: [
            { sub_id: { [Op.substring]: keyword } }, // Ubah id menjadi sub_id sesuai model subscriptions
            { status: { [Op.substring]: keyword } }
        ]
    }

    if(role && role.toUpperCase() === 'CUSTOMER'){
        whereClause.users_id = users_id
    }

    let subscriptions = await subscriptionmodel.findAll({
        where: whereClause,
        include: [`user`, `service_providers`] // PERBAIKAN: relasi service_providers, bukan service_id
    })
    return response.json({
        success: true,
        data: subscriptions,
        message: `Filtered subscriptions have been loaded`
    })
}

exports.addsubscription = async (request, response) => {
    try {
        const users_id = request.body.users_id
        const service_id = request.body.service_id

        const service = await serviceModel.findOne({ where: { service_id: service_id, is_active: true } })
        if (!service) {
            return response.json({
                success: false,
                message: `Service is not active or not found`
            })
        }

        // Cek apakah customer sudah memiliki subscription aktif (status di model ENUM('active', 'inactive'))
        const existingSub = await subscriptionmodel.findOne({ 
            where: { users_id: users_id, status: 'active' } 
        })
        
        if (existingSub) {
            return response.json({
                success: false,
                message: `You already have an active subscription`
            })
        }

        let newsubscription = {
            users_id: request.body.users_id,
            service_id: request.body.service_id,
            status: 'inactive',
            registered_at: new Date()
        }

        let result = await subscriptionmodel.create(newsubscription)
        return response.json({
            success: true,
            data: result,
            message: `New subscription has been inserted`
        })

    } catch(error) {
        return response.json({
            success: false,
            message: error.message
        })
    }  
}

exports.updatesubscription = (request, response) => {
    let dataSubscription = {
        status: request.body.status
    }
    let sub_id = request.params.id

    // PERBAIKAN: Primary key tabel subscriptions adalah sub_id, bukan id
    subscriptionmodel.update(dataSubscription, { where: { sub_id: sub_id } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data subscription has been updated`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

exports.deletesubscription = (request, response) => {
    let sub_id = request.params.id

    // PERBAIKAN: Gunakan sub_id
    subscriptionmodel.destroy({ where: { sub_id: sub_id } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data subscription has been deleted`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}