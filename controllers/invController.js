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
    title: brand + " " + model,
    nav,
    item,
  });
};

/* ***************************
 *  Build menagement view
 * ************************** */
invCont.buildMenagement = async function (req, res, next) {
  console.log("buildMenagement");

  const table = await utilities.buildMenagementView();
  let nav = await utilities.getNav();
  res.render("./inventory/menagement", {
    title: "Inventory Menagement",
    nav,
    table,
  });
};

/* ***************************
 *  Deliver add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  console.log("buildAddClassification");

  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Process Adding Classification
 * *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const table = await utilities.buildMenagementView();

  const { classification_name } = req.body;
  console.log("classification_name:", classification_name);

  const regResult = await invModel.addClassification(classification_name);

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, added classification ${classification_name}.`
    );
    nav = await utilities.getNav();
    res.status(201).render("./inventory/menagement", {
      title: "Inventory Menagement",
      nav,
      table,
    });
  } else {
    req.flash("notice", "Sorry, the process failed.");
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
    });
  }
};

/* ***************************
 *  Deliver add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  console.log("buildAddInventory");
  const classification = await utilities.getClassificationDropdown();
  let nav = await utilities.getNav();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
    classification,
  });
};


module.exports = invCont;
