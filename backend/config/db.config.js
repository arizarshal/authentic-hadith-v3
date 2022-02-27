const mongoose = require('mongoose')
const DB_URI = "mongodb+srv://amazon123:amazon123@cluster0.u9dmv.mongodb.net/test?authSource=admin&replicaSet=atlas-rzvk0v-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";


//Database connection
mongoose.connect( DB_URI,
{   useNewUrlParser: true,
    useUnifiedTopology: true});
const connection = mongoose.connection

module.exports = connection