/** load model for `payments` table */
const paymentModel = require(`../models/index`).payments

/** load Operation from Sequelize */
const Op = require(`sequelize`).Op

/** load library 'path' and 'filestream' */
const path = require(`path`)
const fs = require(`fs`)

/** create function for read all data */
exports.getallpayment = async (request, response) => {
    let payments = await paymentModel.findAll() 
    return response.json({
        success: true,
        data: payments,
        message: `All payments have been loaded`
    })
}

/** create function for filter */
exports.findpayment = async (request, response) => {
    let keyword = request.params.key

    let payments = await paymentModel.findAll({
        where: {
            [Op.or]: [
                { bil_id: { [Op.substring]: keyword } },
                { payment_proof: { [Op.substring]: keyword } },
                { status: { [Op.substring]: keyword } },
                { verified_by: { [Op.substring]: keyword } }
            ]
        }
    })
    return response.json({
        success: true,
        data: payments,
        message: `Filtered payments have been loaded`
    })
}

const upload = require(`./upload_image`).single(`image`)

/** create function to add new payment  */
exports.addpayment = (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }

        if (!request.file) {
            return response.json({ message: `Nothing to Upload` })
        }

        let newpayment = {
            bil_id: request.body.bil_id,
            payment_proof: request.file.filename,
            status: request.body.status,
            verified_by: request.body.verified_by,
        }

        paymentModel.create(newpayment)
        .then(result => {
            return response.json({
                success: true,
                data: result,
                message: `New payment has been inserted`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
    })
}

/** create function to update payment */
exports.updatepayment = async (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }

        let pay_id = request.params.id

        let datapayment = {
            bil_id: request.body.bil_id,
            status: request.body.status,
            verified_by: request.body.verified_by,
        }

        if (request.file) {
            const selectedpayment = await paymentModel.findOne({
                where: { pay_id: pay_id }
            })

            if (selectedpayment && selectedpayment.payment_proof) {
                const oldImage = selectedpayment.payment_proof
                const pathImage = path.join(__dirname, `../image`, oldImage)

                if (fs.existsSync(pathImage)) {
                    fs.unlink(pathImage, error => {
                        if (error) console.log(error)
                    })
                }
            }

            datapayment.payment_proof = request.file.filename    
        }

        paymentModel.update(datapayment, { where: { pay_id : pay_id } })
            .then(result => {
                return response.json({
                    success: true,
                    message: `Data payment has been updated`
                })
            })
            .catch(error => {
                return response.json({
                    success: false,
                    message: error.message
                })
            })
    })
}

/** create function to delete payment */
exports.deletepayment = async (request, response) => {
    const pay_id = request.params.id

    const payment = await paymentModel.findOne({ where: { pay_id: pay_id } })
    
    if (payment && payment.payment_proof) {
        const oldImage = payment.payment_proof
        const pathImage = path.join(__dirname, `../image`, oldImage)

        if (fs.existsSync(pathImage)) {
           fs.unlink(pathImage, error => {
               if (error) console.log(error)
           })
        }
    }

    paymentModel.destroy({ where: { pay_id: pay_id } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data payment has been deleted`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}