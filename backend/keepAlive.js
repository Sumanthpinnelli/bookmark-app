
require('dotenv').config()
const { default: mongoose } = require('mongoose')

async function keepAlive() {
    try{
        const con = await mongoose.createConnection(process.env.URI,{
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