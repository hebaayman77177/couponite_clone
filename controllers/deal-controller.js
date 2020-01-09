const { Deal } = require("../models/deal");
const { idExist } = require("../validationSchemas");
const { ApiSearch }=require("../utils/apiSearch");

async function createDeal(req, res, next) {
  const deal = await Deal.create(req.body);
  return res.status(200).json({
    message: "the deal has been created successfully",
    data: { deal }
  });
}
async function getDeals(req, res, next) {
  const apiSearch = new ApiSearch(Deal.find({}), req.query);
  const deals = await apiSearch
    .filter()
    .sort()
    .limit()
    .paginate().query;

  return res.status(200).json({
    length: deals.length,
    deals
  });
}
async function getDeal(req, res, next) {
  const deal = await Deal.findById(req.params.id);
  return res.status(200).json({
    deal
  });
}
async function deleteDeal(req, res, next) {
  const { id } = req.params;
  const exist = await idExist(id, Deal);
  if (!exist) {
    return res.status(404).json({ message: "not found" });
  }
  const deal = await Deal.findByIdAndRemove(id);
  return res.status(200).json({
    deal
  });
}
async function updateDeal(req, res, next) {
  const { id } = req.params;
  const exist = await idExist(id, Deal);
  if (!exist) {
    return res.status(404).json({ message: "not found" });
  }
  const deal = await Deal.findByIdAndUpdate(id, req.body, {
    new: true
  });
  return res.status(200).json({
    deal
  });
}

module.exports = {
  createDeal,
  getDeals,
  updateDeal,
  deleteDeal,
  getDeal
};
