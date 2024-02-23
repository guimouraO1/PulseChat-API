const UserService = require("../services/UserService");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');

module.exports = {
  
  getUserById: async (req, res) => {
    try {
      let user = await UserService.getUserById(req.userId);

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", result: {} });
    }
  },
  
  getUsers: async (req, res) => {
    try {
      let users = await UserService.getUsers(req.userId);

      res.json(users);
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
  
      // Generate UUID for user ID
      const userId = uuidv4();
      let user = await UserService.register(email, passwordHash, userId);
  
      res.json(user);
    } catch (error) {
      // Handle error
      console.error(error);
      res.status(500).json({ msg: "Internal Server Error" });
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

  getMessageUser: async (req, res) => {
    try {
      let authorMessageId = req.userId;
      let recipientId = req.body.recipientId;
      // let time = req.body.time;
      // let message = req.body.message;

      let messagesRes = await UserService.getMessageUser(
        authorMessageId,
        recipientId
      );

      if (messagesRes) {
        res.json(messagesRes);
      }
    } catch (error) {
      res.status(500).json({});
    }
  },

  postMessage: async (req, res) => {
    try {
      let authorMessageId = req.userId;
      let recipientId = req.body.recipientId;
      let time = req.body.time;
      let message = req.body.message;

      await UserService.postMessage(
        authorMessageId,
        recipientId,
        time,
        message
      );

      res.json({msg: "Message has been sended"});
    } catch (error) {
      res.status(500).json({});
    }
  },
};
