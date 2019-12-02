
const isStringInArray = require('../utils/string-in-array');

function isAuthorized(roles){
    return (req, res, next)=>{
        //console.log('is auth is called');
        if(! req.user){
            return next(new Error('no user'));
        }

        if(isStringInArray(req.user.role, roles)){
            next();
        }else{
            res.statusCode = 401;
            next(new Error('not authorized'));
        }
    }
}

module.exports =  isAuthorized;