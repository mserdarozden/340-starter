const utilities = require(".");
const { body, validationResult } = require("express-validator");

const validate = {};

/*  **********************************
 *  Inventory Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // Validate Make
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Make is required.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage(
        "Make must not contain spaces or special characters. Only letters and numbers are allowed."
      ),

    // Validate Model
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Model is required.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage(
        "Model must not contain spaces or special characters. Only letters and numbers are allowed."
      ),

    // Validate Year
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Year is required.")
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Year must be a number between 1900 and 2100."),

    // Validate Description
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description is required."),

    // Validate Price
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Price is required.")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    // Validate Miles
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Miles is required.")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive whole number."),

    // Validate Color
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Color is required.")
      .matches(/^[a-zA-Z]+$/)
      .withMessage(
        "Color must only contain alphabetic characters (e.g., Red, Blue)."
      ),

    // Validate Classification ID
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification is required.")
  ];
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
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

  let errors = [];
  errors = validationResult(req);
  const classification = await utilities.getClassificationDropdown();

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classification,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

module.exports = validate;
