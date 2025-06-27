const {StatusCodes} = require('http-status-codes')

const {Booking} = require('../models/index')
const {ValidationError,AppError} = require('../utils/errors/index.js')

class BookingRepository {

    async create(data){
        try {
            const booking = await Booking.create(data)
            return booking
        } catch (error) {
            if(error.name = 'SequelizeValidationError'){
                throw new ValidationError(error)
            }
            throw new AppError(
                'RepositoryError',
                'Cannot create Booking',
                'There was issue while creating booking.Please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    }

    async update(bookingId,data){
        try {
        //     The below approach also works but will not return updated object
        //     If we are using pgsql then returning:true can be used , else not
        //     ****************************************************************
        //     await Booking.update(data,{
        //     where:{
        //         id:bookingId
        //     }
        // })
        // return true

            // for getting the updated data in mysql we will use the below approach
            const booking = await Booking.findByPk(bookingId)
            if(data.status){
                booking.status = data.status
            }
            await booking.save()
            return booking

        } catch (error) {
            throw new AppError(
                'RepositoryError',
                'Cannot update Booking',
                'There was issue while updating the booking.Please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    }
}

module.exports = BookingRepository