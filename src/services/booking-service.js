const {BookingRepository} = require('../repository/index')
const axios = require('axios')
const{FLIGHT_SERVICE_PATH} = require('../config/serverConfig.js')
const ServiceError = require('../utils/errors/service-error.js')
class BookingService {
    constructor(){
        this.bookingRepository = new BookingRepository()
    }

    async createBooking(data){
        try {
            const flightId = data.flightId
            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`
            const response = await axios.get(getFlightRequestURL)
            const flightData = response.data.data;
            //console.log(flightData);
            
            let priceOfFlight = flightData.price
            if(data.noOfSeats>flightData.totalSeats){
                throw new ServiceError('Something went wrong in the booking process',
                    'Insufficient seats available in the flight'
                )
            }
            //console.log(flight);
            const totalCosts = priceOfFlight * data.noOfSeats
            const bookingPayload = {...data,totalCosts}
            const booking = await this.bookingRepository.create(bookingPayload)
            //console.log(totalCosts,bookingPayload,booking);
            
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`
            await axios.patch(updateFlightRequestURL,{totalSeats:flightData.totalSeats-booking.noOfSeats})
            const finalBooking = await this.bookingRepository.update(booking.id,{status:'Booked'})

            // console.log(flightData,booking);
            //return booking
            return finalBooking

        } catch (error) {
            if(error.name == 'RepositoryError' || error.name == 'Validation Error'){
                throw error
            }
            throw new ServiceError()
        }
    }

}

module.exports = BookingService