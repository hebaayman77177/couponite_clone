const Joi = require("@hapi/joi");

//systemUser
const systemUserPost = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] }
    })
    .required(),

  phone: Joi.string().pattern(/^01[0125]\d{8,8}$/),

  //TODO:make the roles enum to choose from
  role: Joi.string().required(),

  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required()
});
const systemUserUpdate = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(30),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] }
  }),

  phone: Joi.string().pattern(/^01[0125]\d{8,8}$/),

  //TODO:make the roles enum to choose from
  role: Joi.string(),

  password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/)
});
const systemUserResetToken = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] }
  }),

  phone: Joi.string().pattern(/^01[0125]\d{8,8}$/),

  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required()
}).xor("email", "phone");

const categoryPost = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  parent: Joi.objectId(),
  description: Joi.array().items(Joi.array().items(Joi.string())),
  metaDescription: Joi.array().items(Joi.array().items(Joi.string())),
  tags: Joi.array().items(Joi.string())
});
const categoryUpdate = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(30),
  parent: Joi.objectId(),
  description: Joi.array().items(Joi.array().items(Joi.string())),
  metaDescription: Joi.array().items(Joi.array().items(Joi.string())),
  tags: Joi.array().items(Joi.string())
});
const dealPost = Joi.alternatives().conditional(
  Joi.object({ type: "travel" }).unknown(),
  {
    then: Joi.object({
      color: Joi.forbidden(),
      size: Joi.forbidden(),
      category: Joi.object({ id: Joi.objectId().required() })
        .required()
        .unknown()
    }).unknown(),
    otherwise: Joi.object({
      dayRoom: Joi.forbidden(),
      category: Joi.object({ id: Joi.objectId().required() })
        .required()
        .unknown()
    }).unknown()
  }
);
const changePhone = Joi.object({
  phone: Joi.string().pattern(/^01[0125]\d{8,8}$/).required()
});
//global
const mongoId = Joi.object({
  id: Joi.objectId()
});
const idExist = async function(id, Model) {
  const doc = await Model.findById(id);
  if (doc) {
    return true;
  }
  return false;
};
const login = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] }
  }),
  loginField: Joi.string(),
  phone: Joi.string().pattern(/^01[0125]\d{8,8}$/),

  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required()
}).xor("email", "phone", "loginField");
const schemas = {
  //systemUser
  systemUserPost,
  systemUserUpdate,
  systemUserResetToken,
  //category
  categoryPost,
  categoryUpdate,
  //deal
  dealPost,
  //user
  changePhone,
  //golbal
  mongoId,
  idExist,
  login
};
module.exports = schemas;
