require('dotenv').config()
const axios = require('axios')
const { default: mongoose } = require('mongoose')

async function keepAlive() {
    try{
        const URL = process.env.URI
        const con = await mongoose.createConnection(URL,{
            useNewUrlParser:true,
            useUnifiedTopology: true
        })
        await con.db.admin().ping();
        console,log('MongoDb kept alive');
        await con.close();
    }
    catch(err)
    {
        console.error('mongoDb keep-alive failed:',err.message)
    }
    
}

setInterval(keepAlive,1000*60*14)