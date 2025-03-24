const utilities = require("../utilities")
const errorHandlingTestController = {}

errorHandlingTestController.buildError = async function(req, res){
  const nav = await utilities.getNav()
  console.log('Error Test Controller in Action')
  res.render("test", {title: "test", nava})
  
}

module.exports = errorHandlingTestController