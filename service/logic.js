// import model

// Register logic 
const db = require('./DataBs')
const jwt = require('jsonwebtoken')


// Register Logic
register = (acno , psw , uname) => {

   return db.User.findOne({ acno }).then(user => {

        if (user) {
            
            return {
                message     :   "User Already Present" ,
                status      :   false ,
                statusCode  :   404   
            }

        }
        else {

            newUser = new db.User({
                acno        :   acno , 
                uname       :   uname ,
                psw         :   psw ,
                balance     :   0 ,
                transaction :   []
            })
    // To Reflect the changes done by Server in Database 
        newUser.save()
        
            return {
                message     :   "Registered Successfully" ,
                status      :   true ,
                statusCode  :   200   
            }

        }   

    })  

}



// Login logic
login = (acNo , Paw) => {

    return db.User.findOne({acno : acNo , psw : Paw}).then(user => {

        if (user) {

            // Token generation
            const token = jwt.sign({acNo} , "bankKey@98")

            return {
                message         :   "Login Success" ,
                status          :   true ,
                statusCode      :   200 ,
                currentUser     :   user.uname , 
                currentAcno     :   user.acno ,
                token      
            } 

        }
        else {

            return {
                message     :   "InCorrect Account_number Or Password" ,
                status      :   false ,
                statusCode  :   404   
            } 

        }

    })

}


// getUser Logic Function
getUser = (acno) => {

    return db.User.findOne({acno}).then(user => {

        if (user) {

            return {
                message     :   user ,
                status      :   true ,
                statusCode  :   200 ,   
            }
            
        }
        else {
            return {

                message     :   "User Not Found !!" ,
                status      :   false ,
                statusCode  :   404   
            }  

        }

    })

}



// get Balance logic Function

getBalance = (acno) => {

    return db.User.findOne({acno}).then(user => {

        if (user) {

            return {
                message     :   user.balance ,
                status      :   true ,
                statusCode  :   200 ,   
            } 

        }
        else {
            return {

                message     :   "User Not Found !!" ,
                status      :   false ,
                statusCode  :   404   
            }    

        }

    })
}



moneyTransfer = (FromAcno , ToAcno , Amount , psw , Date ) => {

    return db.User.findOne({acno : FromAcno , psw}).then(FromUser => {
        
        if (FromUser) {

            return db.User.findOne({acno : ToAcno}).then(ToUser => {

                if (ToUser) {
                    
                    Amount = parseInt(Amount)

                        if (Amount > FromUser.balance) {

                            return {
                                message     :   "insufficient balance :( !!" ,
                                status      :   false ,
                                statusCode  :   404   
                            }

                        }
                        else {

                            FromUser.balance = FromUser.balance-Amount
                            FromUser.transaction.push({type : 'Debited' , Amount , Date})
                            FromUser.save()
                            
                            ToUser.balance = ToUser.balance+Amount
                            ToUser.transaction.push({type : 'Credit' , Amount , Date})
                            ToUser.save()

                            return {
                                message     :   "Transaction Success :)" ,
                                status      :   true ,
                                statusCode  :   200   
                            }

                        }

                }
                else {
                    // Not a User
                    return {
                        message     :   "invalid Credit Crendentials :( !!" ,
                        status      :   false ,
                        statusCode  :   404   
                    }

                }

            })
        }
        else {
            // not from user
            return {
                message     :   "invalid Debit Crendentials :( !!" ,
                status      :   false ,
                statusCode  :   404   
            }

        }

    })

}






getTransaction = (acno) => {

    return db.User.findOne({acno}).then(user => {

        if (user) {

            return {
                message     :   user.transaction ,
                status      :   true ,
                statusCode  :   200   
            }

        }
        else {

            return {
                message     :   "User Not Exist :( !!" ,
                status      :   false ,
                statusCode  :   404   
            }

        }

    })

}






deleteAcc = acno => {

    return db.User.deleteOne({acno}).then(result => {

        if (result) {

            return {
                message     :   "Bank account Deleted !!!" ,
                status      :   true ,
                statusCode  :   200   
            }

        }
        else {

            return {
                message     :   "account Not present"  ,
                status      :   false ,
                statusCode  :   200   
            }

        }

    })
    
}




module.exports = {
    register , login , getUser , getBalance , moneyTransfer , getTransaction , deleteAcc
}