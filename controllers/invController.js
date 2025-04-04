const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
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
  const inventory_id = req.params.inventoryId;
  const data = await invModel.getInventoryItemByInvId(inventory_id);

  const item = await utilities.buildInventoryItemView(data);
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
  const classification = await utilities.getClassificationDropdown();
  const table = await utilities.buildMenagementView();
  let nav = await utilities.getNav();
  res.render("./inventory/menagement", {
    title: "Inventory Menagement",
    nav,
    table,
    classification
  });
};

/* ***************************
 *  Deliver add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {

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
  const classification = await utilities.getClassificationDropdown();
  let nav = await utilities.getNav();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
    classification,
  });
};

/* ****************************************
 *  Process Adding Inventory
 * *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const classification = await utilities.getClassificationDropdown();
  const table = await utilities.buildMenagementView();

  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;


  const regResult = await invModel.addInventoryItem(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  console.log(regResult);
  if (regResult) {
    req.flash("notice", `Congratulations, added inventory item ${inv_make}.`);
    res.status(201).render("./inventory/menagement", {
      title: "Inventory Menagement",
      nav,
      table,
      classification,
    });
  } else {
    req.flash("notice", "Sorry, the process failed.");
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors,
      classification,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Deliver edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventoryId); // Collect and store inventory_id as an integer
  // console.log(inventory_id);
  const data = await invModel.getInventoryItemByInvId(inventory_id);
  let nav = await utilities.getNav();

  
  const itemData = data[0];
  const classification_id = itemData.classification_id;
  const classification = await utilities.getClassificationDropdown(classification_id);

  const brand = itemData.inv_make;
  const model = itemData.inv_model;
  res.render("./inventory/edit-inventory", {
    title: "Edit" + " " + brand + " " + model,
    nav,
    classification,
    errors: null, // check errors for later
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: classification_id
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.getClassificationDropdown(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Deliver delete inventory view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventoryId); // Collect and store inventory_id as an integer
  // console.log(inventory_id);
  const data = await invModel.getInventoryItemByInvId(inventory_id);
  let nav = await utilities.getNav();

  const itemData = data[0];
  const brand = itemData.inv_make;
  const model = itemData.inv_model;
  res.render("./inventory/delete-confirm", {
    title: "Delete" + " " + brand + " " + model,
    nav,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id);
  const {
    inv_make,
    inv_model,
    inv_price,
    inv_year,
  } = req.body

  const deleteItem = await invModel.deleteInventory(inv_id);

  if (deleteItem) {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}


module.exports = invCont;
