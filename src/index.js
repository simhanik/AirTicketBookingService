const express = require('express')
const bodyParser = require('body-parser')
const {PORT,DB_SYNC} = require('./config/serverConfig.js')
const apiRoutes = require('./routes/index.js')

const{FLIGHT_SERVICE_PATH} = require('../src/config/serverConfig.js')

const db = require('./models/index.js')

const app = express()

const setupAndStartServer = () => {

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:true}))

    app.use('/api',apiRoutes)

    app.listen(PORT, ()=>{
        console.log(`Server started on Port : ${PORT}`);

        if(DB_SYNC){
            db.sequelize.sync({alter:true})
        }
        
        console.log(FLIGHT_SERVICE_PATH);
        
    })

}

setupAndStartServer()