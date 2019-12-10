var mongoose = require('mongoose')
var MAILMODULE =require('../modules/mailmodule')

function mailfunction (app){
    app.post('/sendmail' , (req ,res)=>{
        const {tag , sender , SenderName , SenderEmail , name , scheduledAt , subject ,replyTo  } = req.body
        let clint = new MAILMODULE({
            _id:mongoose.Types.ObjectId(),
            tag,
            sender,
            SenderName,
            SenderEmail,
            name,
            scheduledAt,
            subject,
            replyTo

        
        
        })
        clint.save((err , data)=>{
            err?
            res.json({massage:'error'})
            :
            res.json({massage:'sucsses' , 'data':data})

        })





    })




}
module.exports = mailfunction