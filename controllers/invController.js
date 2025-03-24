const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  //console.log("classification", classification_id)
  const data = await invModel.getInventoryByClassificationId(classification_id);

  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory by inventory id view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  console.log("buildByInventoryId");
  const inventory_id = req.params.inventoryId;
  //console.log("inventoryId:", inventory_id);
  const data = await invModel.getInventoryItemByInvId(inventory_id);
  console.log("data:", data);

  const item = await utilities.buildInventoryItemView(data);
  console.log("item:", item);
  let nav = await utilities.getNav();
  const brand = data[0].inv_make;
  const model = data[0].inv_model;
  res.render("./inventory/item", {
    title: brand + ' ' + model ,
    nav,
    item,
  });
};

module.exports = invCont;
