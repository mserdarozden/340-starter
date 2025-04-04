// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/");
const regValidate = require('../utilities/account-validation')
const loginValidate = require('../utilities/login-validation')



// Route to build account by account view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to build account view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildMenagement));

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

  // Process the login attempt
router.post(
  "/login",
  loginValidate.loginRules(),
  loginValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
  
)
  // Route to build update view
  router.get("/update", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountUpdate));

  // Process the updating account
router.post(
  "/update",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)
  
router.post(
  "/updatePassword",
  regValidate.updatePasswordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

// Logout route
router.get("/logout", accountController.logout);

module.exports = router;
