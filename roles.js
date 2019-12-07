const AccessControl = require("accesscontrol");

const ac = new AccessControl();

const roles = (function() {
  ac.grant("dataEntry").readOwn("systemUser");

  ac.grant("onlyViewUser")
    .extend("dataEntry")
    .readAny("systemUser");

  ac.grant("admin")
    .extend("dataEntry")
    .extend("onlyViewUser")
    .createAny("systemUser")
    .updateAny("systemUser")
    .deleteAny("systemUser")
    //category
    .createAny("category")
    .updateAny("category")
    .deleteAny("category");

  return ac;
})();
function grantAccess(action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        //check ownership
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
      if (action.includes("Own")) {
        if (req.user._id !== req.params.id) {
          return res.status(401).json({
            error: "You don't have enough permission to perform this action"
          });
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
module.exports = {
  roles,
  grantAccess
};
