const paymentModel = require(`../models/index`).payments
const billingModel = require(`../models/index`).billings
const subscriptionModel = require(`../models/index`).subscriptions
const Op = require(`sequelize`).Op
const path = require(`path`)
const fs = require(`fs`)
const upload = require(`./upload_image`).single(`payment_proof`)

exports.getallpayment = async (request, response) => {
    let payments = await paymentModel.findAll({ include: [`billing`] }) 
    return response.json({
        success: true,
        data: payments,
        message: `All payments have been loaded`
    })
}

exports.findpayment = async (request, response) => {
    let keyword = request.params.key

    let payments = await paymentModel.findAll({
        where: {
            [Op.or]: [
                { id: { [Op.substring]: keyword } },
                { status: { [Op.substring]: keyword } }
            ]
        },
        include: [`billing`]
    })
    return response.json({
        success: true,
        data: payments,
        message: `Filtered payments have been loaded`
    })
}

exports.addpayment = (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ success: false, message: error })
        }

        if (!request.file) {
            return response.json({ success: false, message: `Nothing to Upload` })
        }

        try {
            let bil_id = request.body.bil_id

            let newpayment = {
                bil_id: request.body.bil_id,
                payment_proof: request.file.filename,
                status: "PENDING",
                verified_by: null,
                verified_at: null
            }

            let result = await paymentModel.create(newpayment)

            // Ubah status billing menjadi WAITING_VERIFICATION
            await billingModel.update({ status: "WAITING_VERIFICATION" }, { where: { bil_id: bil_id } })

            return response.json({
                success: true,
                data: result,
                message: `Payment proof uploaded successfully, waiting for verification`
            })
        } catch(error) {
            return response.json({
                success: false,
                message: error.message
            })
        }
    })
}

exports.updatepayment = async (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ success: false, message: error })
        }

        let pay_id = request.params.pay_id
        let user_id = request.body.verified_by 

        // Validasi opsional: Cek apakah user_id dikirim
        if (!user_id) {
            return response.json({ 
                success: false, 
                message: `User ID (admin) tidak boleh kosong. Harap kirimkan 'user_id' di request body.` 
            })
        }

        let datapayment = {
            status: request.body.status, // APPROVED / REJECTED
            verified_by: user_id, 
            verified_at: new Date()
        }

        try {
            let payment = await paymentModel.findOne({ 
                where: { pay_id: pay_id }, 
                include: [`billing`]
            })

            if (!payment) {
                return response.json({ success: false, message: `Payment not found` })
            }

           await paymentModel.update(datapayment, { where: { pay_id: pay_id } })

            // 2. Cek apakah data billing ditemukan melalui relasi
            console.log("Data Billing:", payment.billing); // Cek di terminal/console VS Code

            if (payment.billing) {
                let sub_id = payment.billing.sub_id;
                let bil_id = payment.bil_id;
                let currentStatus = datapayment.status;

                if (currentStatus === "APPROVED") {
                    await billingModel.update({ status: "PAID" }, { where: { bil_id: payment.bil_id } });
                    if (sub_id) {
                        await subscriptionModel.update({ status: "ACTIVE" }, { where: { sub_id: sub_id } });
                    }
                } else if (currentStatus === "REJECTED") {
                    await billingModel.update({ status: "UNPAID" }, { where: { bil_id: payment.bil_id } });
                    if (sub_id) {
                        await subscriptionModel.update({ status: "INACTIVE" }, { where: { sub_id: sub_id } });
                    }
                }
            } else {
                console.log("PERINGATAN: payment.billing bernilai null/undefined. Periksa kembali relasi (association) pada model Sequelize.");
            }

            return response.json({
                success: true,
                message: `Payment verification status updated successfully and related tables updated`
            })
        } catch(error) {
            return response.json({
                success: false,
                message: error.message
            })
        }
    })
}
exports.deletepayment = async (request, response) => {
    const pay_id = request.params.pay_id

    const payment = await paymentModel.findOne({ where: { id: pay_id } })
    
    if (payment && payment.payment_proof) {
        const oldImage = payment.payment_proof
        const pathImage = path.join(__dirname, `../image`, oldImage)

        if (fs.existsSync(pathImage)) {
           fs.unlink(pathImage, err => { if (err) console.log(err) })
        }
    }

    paymentModel.destroy({ where: { id: pay_id } })
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