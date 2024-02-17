const UserService = require("../services/UserService");
const userService = require("../services/UserService");
const bcrypt = require("bcryptjs");

module.exports = {
  getUserById: async (req, res) => {
    try {
      let user = await UserService.getUserById(req.userId);

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", result: {} });
    }
  },

  getUserByEmail: async (req, res) => {
    try {
      let email = req.body.email;
      let user = await UserService.getUserByEmail(email);

      if (user) {
        res.json(user);
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", result: {} });
    }
  },

  register: async (req, res) => {
    try {
      let email = req.body.email;
      let password = req.body.password;
      let confirmPassword = req.body.confirmPassword;

      if (!email) {
        return res.status(422).json({ msg: "Email is required" });
      }
      if (!password) {
        return res.status(422).json({ msg: "Password is required" });
      }
      if (password !== confirmPassword) {
        return res.status(422).json({ msg: "Passwords do not match" });
      }

      const userExists = await UserService.getUserByEmail(email);
      if (userExists) {
        return res
          .status(422)
          .json({ msg: "Email already registered, please try another one." });
      }

      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      let user = await UserService.register(email, passwordHash);

      res.json(user);
    } catch (error) {
      // Handle error
    }
  },

  login: async (req, res) => {
    
    let email = req.body.email;
    let password = req.body.password;
      
    if (!email) {
      return res.status(422).json({ msg: "Email is required" });
    }
    if (!password) {
      return res.status(422).json({ msg: "Password is required" });
    }

    const userExists = await UserService.getUserByEmail(email);
    if (!userExists) {
      return res.status(404).json({ msg: "User not found!" });
    }

    const checkPassword = await bcrypt.compare(password, userExists.password);
    if (!checkPassword) {
      return res.status(422).json({ msg: "Invalid password!" });
    }

    try {
      let user = await UserService.login(email, userExists.password);

      res.json(user);
    } catch (error) {
      json.error = "An error occurred during login";
      res.status(500).json(json);
    }
  },

  auth: async (req, res) => {
    res.json({ user: req.userId });
  },
 
};
