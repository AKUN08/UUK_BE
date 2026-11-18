/** load model for `users` table */				
const userModel = require(`../models/index`).users
const md5 = require(`md5`)

/** load Operation from  Sequelize  */
const Op = require(`sequelize`).Op

/** create function for read all data */
exports.getalluser = async (request, response) => {
    /** call findAll() to get all data */
    let users = await userModel.findAll()
    return response.json({
        success: true,
        data: users,
        message: `All users have been loaded`
    })
}

/** create function for filter */
exports.finduser = async (request, response) => {
    /** define keyword to find data */
    let keyword = request.params.key

    /** call findAll() within where clause and operation 
     * to find data based on keyword  */
    let users = await userModel.findAll({
        where: {
            [Op.or]: [
                { users_id: { [Op.substring]: keyword } },
                { name: { [Op.substring]: keyword } },
                { email: { [Op.substring]: keyword } },
                { password: { [Op.substring]: keyword } },
                { role: { [Op.substring]: keyword } }
            ]
        }
    })
    return response.json({
        success: true,
        data: users,
        message: `All users have been loaded`
    })
}

/** create function for add new user */
exports.adduser = (request, response) => {
    /** prepare data from request */
    let newuser = {
        name: request.body.name,
        email: request.body.email,
        password: md5(request.body.password),
        role: request.body.role
    }

    /** execute inserting data to user's table */
    userModel.create(newuser)

       .then(result => {
            /** if insert's process success */
            return response.json({
                success: true,
                data: result,
                message: `New user has been inserted`
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

/** create function for update user */
exports.updateuser = (request, response) => {
    /** prepare data that has been changed */
    let datauser = {
        name: request.body.name,
        email: request.body.email,
        role: request.body.role
    }
    if (request.body.password) {
        datauser.password = md5(request.body.password)
    }
    /** define id user that will be update */
    let user_id = request.params.id

    /** execute update data based on defined id user */
    userModel.update(datauser, { where: { user_id : user_id } })
        .then(result => {
            /** if update's process success */
            return response.json({
                success: true,
                message: `Data user has been updated`
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
exports.deleteuser = (request, response) => {
    /** define id user that will be update */
    let user_id = request.params.id

    /** execute delete data based on defined id user */
    userModel.destroy({ where: { user_id: user_id } })
        .then(result => {
            /** if update's process success */
            return response.json({
                success: true,
                message: `Data user has been deleted`
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

exports.resetpassword = (request, response) => {
    let user_id = request.params.id
    let newpassword = md5(request.body.password)
    userModel.update({ password: newpassword }, { where: { user_id: user_id } })
        .then(result => {
            return response.json({
                success: true,
                message: `Password has been reset`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

exports.register = (request, response) => {
    let newuser = {
        name: request.body.name,
        email: request.body.email,
        password: md5(request.body.password),
        role: `user`
    }
    userModel.create(newuser)
        .then(result => {
            return response.json({
                success: true,
                data: result,
                message: `New user has been registered`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
    }   