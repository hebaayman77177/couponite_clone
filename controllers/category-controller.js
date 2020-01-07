const { Category } = require("../models/category");
const { idExist } = require("../validationSchemas");

async function buildAncestors(id, parentId) {
  const ancestors = [];
  let parent;
  while (parentId) {
    // eslint-disable-next-line no-await-in-loop
    parent = await Category.findById(parentId, {
      parent: 1,
      name: 1,
      slug: 1,
      ancestors: 1
    });
    parentId = parent.parent;
    ancestors.push(parent);
  }
  return await Category.findByIdAndUpdate(id, { ancestors }, { new: true });
}

async function buildSubgraph(root) {
  const rootId = root.id;
  const nodes = await Category.find(
    { ancestors: { $elemMatch: { _id: rootId } } },
    { parent: 1, name: 1, slug: 1, ancestors: 1 }
  );
  const nodesByParent = {};
  try {
    nodes.forEach(node => {
      if (!(node.parent in nodesByParent)) {
        nodesByParent[node.parent] = [];
      }
      nodesByParent[node.parent].push(node);
    });
  } catch (err) {}
  return nodesByParent;
}
async function updateNodeAndDescendants(nodesByParent, node, parent) {
  parent = await Category.findById(parent);
  // eslint-disable-next-line prefer-destructuring
  const ancestors = parent.ancestors;
  ancestors.push([{ _id: parent._id, slug: parent.slug, name: parent.name }]);
  node = await Category.findByIdAndUpdate(
    node._id,
    {
      ancestors: ancestors,
      parent: parent._id
    },
    { new: true }
  );
  if (node._id in nodesByParent) {
    nodesByParent[node._id].forEach(async function(child) {
      await updateNodeAndDescendants(nodesByParent, child, node);
    });
  }
}
async function createCategory(req, res, next) {
  let category = await Category.create(req.body);
  if (req.body.parent) {
    category = await buildAncestors(category._id, category.parent);
  }
  return res.status(200).json({
    data: category
  });
}

async function getCategories(req, res, next) {
  const categories = await Category.find();
  return res.status(200).json({
    length: categories.length,
    data: categories
  });
}

async function getCategory(req, res, next) {
  const category = await Category.findById(req.params.id);
  return res.status(200).json({
    data: category
  });
}

async function updateCategory(req, res, next) {
  const { id } = req.params;
  const exist = await idExist(id, Category);
  if (!exist) {
    return res.status(404).json({ message: "not found" });
  }
  if (req.body.parent !== undefined) {
    const cat = await Category.findById(id);
    const nodesByParent = await buildSubgraph(cat);
    await updateNodeAndDescendants(nodesByParent, cat, req.body.parent);
  }
  delete req.body.parent;
  const category = await Category.findByIdAndUpdate(id, req.body, {
    new: true
  });
  return res.status(200).json({
    data: category
  });
}

async function deleteCategory(req, res, next) {
  const { id } = req.params;
  const exist = await idExist(id, Category);
  if (!exist) {
    return res.status(404).json({ message: "not found" });
  }
  const category = await Category.findByIdAndDelete(id);
  return res.status(200).json({
    data: category
  });
}

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
};
