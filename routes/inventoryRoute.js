// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const classificationValidate = require('../utilities/classification-validation')
const inventoryValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build detail by inventory id
router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByInventoryId)
);

// Route to build management view
router.get("/", utilities.checkAdminAccess, utilities.handleErrors(invController.buildMenagement));

// Route to build add classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);

// Process the adding classification data
router.post(
  "/add-classification",
  classificationValidate.classificationRules(),
  classificationValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);

// Process the adding classification data
router.post(
  "/add-inventory",
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Route to build edit classification view

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build edit by inventory id
router.get(
  "/edit/:inventoryId",
  utilities.handleErrors(invController.buildEditInventory)
);

// Process the editing classification data
router.post("/update/", 
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Route to delete item by inventory id
router.get(
  "/delete/:inventoryId",
  utilities.handleErrors(invController.buildDeleteInventory)
);

// Process the deleting classification data
router.post("/delete/", 
  utilities.handleErrors(invController.deleteInventory)
)

router.get("/search", utilities.handleErrors(invController.searchInventory));

module.exports = router;
