const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { firstName, lastName, email, password } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    firstName,
    lastName,
    email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${firstName}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { email, password } = req.body;
  const accountData = await accountModel.getAccountByEmail(email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      req.flash("notice", `Congratulations, you\'re logged in.`);
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Deliver account view
 * *************************************** */
async function buildMenagement(req, res, next) {
  let nav = await utilities.getNav();

  const accountData = await accountModel.getAccountById(
    res.locals.accountData.account_id
  );
  const first_name = accountData.account_firstname;
  const account_type = accountData.account_type;

  res.render("account/account", {
    title: "My Account",
    nav,
    errors: null,
    account_type,
    first_name,
  });
}

/* ****************************************
 *  Deliver update view
 * *************************************** */
async function buildAccountUpdate(req, res, next) {
  let nav = await utilities.getNav();
  const accountData = await accountModel.getAccountById(
    res.locals.accountData.account_id
  );

  const first_name = accountData.account_firstname;
  const last_name = accountData.account_lastname;
  const account_email = accountData.account_email;
  const account_id = accountData.account_id;
  const account_password = accountData.account_password;
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    first_name,
    last_name,
    account_email,
    account_id,
    account_password,
  });
}

/* ***************************
 *  Update Account Data
 * ************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav();
  const { first_name, last_name, account_email, account_id } = req.body;

  const updateResult = await accountModel.updateAccount(
    first_name,
    last_name,
    account_email,
    account_id
  );

  if (updateResult) {
    const userName =
      updateResult.account_firstname + " " + updateResult.account_lastname;
    req.flash(
      "notice",
      `${userName}, your credentals were successfully updated.`
    );
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      first_name,
      last_name,
      account_email,
      account_id,
    });
  }
}

/* ***************************
 *  Update Account Data
 * ************************** */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav();
  const { first_name, last_name, account_email, account_id, account_password } = req.body;

   // Hash the password before storing
   let hashedPassword;
   try {
     // regular password and cost (salt is generated automatically)
     hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
      req.flash(
        "notice",
        "Sorry, there was an error processing the update."
      );
      res.status(500).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        first_name,
        last_name,
        account_email,
        account_id,
      });
    }

  const updateResult = await accountModel.updatePassword(
    hashedPassword,
    account_id);
 

  if (updateResult) {
    const userName =
      updateResult.account_firstname + " " + updateResult.account_lastname;
    req.flash(
      "notice",
      `${userName}, your password was successfully updated.`
    );
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      first_name,
      last_name,
      account_email,
      account_id,
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildMenagement,
  buildAccountUpdate,
  updateAccount,
  updatePassword,
};
