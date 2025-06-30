const {BookingService} = require('../services/index')

const {StatusCodes} = require('http-status-codes')

const bookingService = new BookingService()

const {createChannel, publishMessage} = require('../utils/messageQueue.js')
const {REMINDER_BINDING_KEY} = require('../config/serverConfig.js')

class BookingController {

    constructor(){}
    async sendMessageToQueue(req,res) {
        const channel = await createChannel()
        const payload = {
            data:{
                subject:'This is a notification from queue',
                content:'Some queue will subscribe this',
                recepientEmail:'sahudupesh431@gmail.com',
                notificationTime:'2025-06-30T05:12:00.000Z'
            },
            service:'CREATE_TICKET'
        }
        publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(payload))
        return res.status(200).json({
            message:'Successfully published the event'
        })
    }

    async create(req,res) {
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
}

// const create = async(req,res) => {
//     try {
//         const response =await bookingService.createBooking(req.body)
//         return res.status(StatusCodes.OK).json({
//             data:response,
//             success:true,
//             err:{},
//             message:'Succesfully completed booking'
//         })
//     } catch (error) {
//         return res.status(error.statusCodes||500).json({
//             data:{},
//             success:false,
//             err:error.explanation,
//             message:error.message
//         })
//     }
// }


module.exports = BookingController
