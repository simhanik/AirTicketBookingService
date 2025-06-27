const {BookingService} = require('../services/index')

const {StatusCodes} = require('http-status-codes')

const bookingService = new BookingService()

const create = async(req,res) => {
    try {
        const response =await bookingService.createBooking(req.body)
        return res.status(StatusCodes.OK).json({
            data:response,
            success:true,
            err:{},
            message:'Succesfully completed booking'
        })
    } catch (error) {
        return res.status(error.statusCodes||500).json({
            data:{},
            success:false,
            err:error.explanation,
            message:error.message
        })
    }
}

module.exports = {
    create
}
