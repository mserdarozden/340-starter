const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildGrid = async function (data) {
  let grid = "";
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the vehicle view HTML
 * ************************************ */
Util.buildInventoryItemView = async function (vehicle) {
  let item = "";
  if (vehicle.length > 0) {
    const v = vehicle[0]; // Access the first object in the array
    item += '<div class="item-container">';
    item +=
      '<img src="' +
      v.inv_image +
      '" alt="Image of ' +
      v.inv_make +
      " " +
      v.inv_model +
      ' on CSE Motors" />';
    item += '<div class="detail-container">';
    item += "<h3>Mechanical Special Details</h3>";
    item +=
      "<p><strong>Price:</strong> $" +
      new Intl.NumberFormat("en-US").format(v.inv_price) +
      "</p>";
    item += "<p><strong>Year:</strong> " + v.inv_year + "</p>";
    item += "<p><strong>Description:</strong>" + v.inv_description + "</p>";
    item +=
      "<p><strong>Miles:</strong> " +
      new Intl.NumberFormat("en-US").format(v.inv_miles) +
      "</p>";
    item += "<p><strong>Color:</strong> " + v.inv_color + "</p>";
    item += "</div>";
    item += "</div>";
  } else {
    item += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return item;
};

/* **************************************
 * Build the management view HTML
 * ************************************ */
Util.buildMenagementView = async function () {
  let item = "";

  // Add links for "Add New Classification" and "Add New Inventory"
  item += '<div class="management-links">';
  item +=
    '<a href="/inv/add-classification" class="btn">Add New Classification</a>';
  item += '<a href="/inv/add-inventory" class="btn">Add New Inventory</a>';
  item += "</div>";

  return item;
};

/* **************************************
 * Build the classification dropdown list
 * ************************************ */
Util.getClassificationDropdown = async function (selectedId = null) {
  let data = await invModel.getClassifications(); // Fetch classifications from the database
  let dropdown =
    '<select id="classificationId" name="classification_id" required>';
  dropdown += '<option value="">Select a Classification</option>'; // Default option

  data.rows.forEach((row) => {
    // Check if the current classification_id matches the selectedId
    let selected = row.classification_id == selectedId ? "selected" : "";
    dropdown += `<option value="${row.classification_id}" ${selected}>${row.classification_name}</option>`;
  });

  dropdown += "</select>";

  return dropdown;
};

/**
 * ***************************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 * Unit 3, Activities
 * ***************************************************
 */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {

    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 * Middleware to check Admin or Employee access
 **************************************** */
Util.checkAdminAccess = (req, res, next) => {
  if (res.locals.accountData && (res.locals.accountData.account_type === "Admin" || res.locals.accountData.account_type === "Employee")) {
    next(); // Allow access if account type is Admin or Employee
  } else {
    req.flash("notice", "You do not have permission to access this resource.");
    return res.redirect("/account/login"); // Redirect to login on failure
  }
};
 
module.exports = Util;
