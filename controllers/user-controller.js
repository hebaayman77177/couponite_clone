
const {User, validate} = require('../models/user');
const _ = require('lodash');

async function create(req, res, next){

    const result = validate(req);
    if (result.error){
        res.statusCode = 422;
        //return res.send(result.error.details[0].message);
        return res.json(result);
    }
    res.json(result);

}

async function login(req, res, next){

    try{
        const user = await  User.findOne({emai: req.body.email});
        
        if (!( user) || !(user.verifyPassword(req.body.password))){
            res.statusCode = 401;
            return res.json({message: 'email or passsord is invalid'});
        }else if( ! user.isVerified){
            res.statusCode = 401;
            return res.json({message: 'youre must verify first'});
        }else{
            return res.json({
                token: user.gnerateToken(),
                user: _.pick(user, ['firstName', 'lastName', '_id', 'role'])
            });
        }
    }catch(err){
        next(err);
    }
}

module.exports = {
    create: create
}