const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle view HTML
* ************************************ */
Util.buildInventoryItemView = async function(vehicle){
  let item = ""
  if(vehicle.length > 0){
    const v = vehicle[0] // Access the first object in the array
    item += '<div class="item-container">'
    item += '<img src="' + v.inv_image 
      + '" alt="Image of ' + v.inv_make + ' ' + v.inv_model 
      + ' on CSE Motors" />'
    item += '<div class="detail-container">'
    item += '<h3>Mechanical Special Details</h3>'
    item += '<p><strong>Price:</strong> $' 
      + new Intl.NumberFormat('en-US').format(v.inv_price) + '</p>'
    item += '<p><strong>Year:</strong> ' + v.inv_year + '</p>'
    item += '<p><strong>Description:</strong>' + v.inv_description + '</p>'
    item += '<p><strong>Miles:</strong> ' + new Intl.NumberFormat('en-US').format(v.inv_miles) + '</p>'
    item += '<p><strong>Color:</strong> ' + v.inv_color + '</p>'
    item += '</div>'
    item += '</div>'
  } else { 
    item += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return item
}

/* **************************************
* Build the menagement view HTML
* ************************************ */
Util.buildMenagementView = async function(){
  let item = "";

  // Add links for "Add New Classification" and "Add New Inventory"
  item += '<div class="management-links">';
  item += '<a href="/classification/add" class="btn">Add New Classification</a>';
  item += '<a href="/inventory/add" class="btn">Add New Inventory</a>';
  item += '</div>';
 
  return item
}

/**
 * ***************************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 * Unit 3, Activities
 * ***************************************************
 */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util

