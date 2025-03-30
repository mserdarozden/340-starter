const utilities = require("../utilities/")
const errorHandlingTestController = {}

errorHandlingTestController.buildError = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

module.exports = errorHandlingTestController