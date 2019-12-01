
const {User, validate} = require('../models/user');

async function create(req, res, next){

    const result = validate(req);
    if (result.error){
        res.statusCode = 422;
        //return res.send(result.error.details[0].message);
        return res.json(result);
    }
    res.json(result);

}

module.exports = {
    create: create
}