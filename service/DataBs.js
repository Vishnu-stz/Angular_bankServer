// import mongoose

const mongoose = require("mongoose")

mongoose.connect('mongodb://127.0.0.1:27017/bankServer')

// Model for collection         // Schema - Feilds and values in Model
const User = mongoose.model('User' , {
    acno        :   Number , 
    uname       :   String ,
    psw         :   String ,
    balance     :   Number ,
    transaction :   []
}) 


// export Model
module.exports = {
    User
}

