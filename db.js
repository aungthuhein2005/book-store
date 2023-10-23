const {MongoClient}= require("mongodb");

let dbConnection;

module.exports = {
    connectToDb : (cb) => {
        MongoClient.connect('mongodb://127.0.0.1:27017/bookstore') //connect to mongodb local server
        .then((client)=>{ //if connection success do this block
            dbConnection = client.db(); // connect to datbase
            return cb(); // return callback function
        })
        .catch((err)=>{ //if connection fail do this block
            console.log(err); //log error
            return cb(err); //return callback function with error
        })
    },
    getDb : () => dbConnection // get database what connected
}