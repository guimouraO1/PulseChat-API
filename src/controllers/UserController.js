const UserService = require("../services/UserService");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

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
      let name = req.body.name;

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
      let user = await UserService.register(email, passwordHash, userId, name);

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
      const authorMessageId = req.userId;
      const recipientId = req.query.recipientId;
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 10;

      const messagesRes = await UserService.getMessageUser(
        authorMessageId,
        recipientId,
        offset,
        limit
      );

      if (messagesRes) {
        res.json(messagesRes);
      } else {
        res.status(404).json({ error: "Mensagens não encontradas" });
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens do usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  postMessage: async (authorMessageId, recipientId, time, message) => {
    try {
      let messageId = uuidv4();

      await UserService.postMessage(
        authorMessageId,
        recipientId,
        time,
        message,
        messageId
      );

      return { msg: "Message has been sent" };
    } catch (error) {
      throw new Error("Error sending message");
    }
  },

  updateMessageAsRead: async (req, res) => {
    try {
      const authorMessageId = req.body.authorMessageId;
      const recipientId = req.body.recipientId;
      // console.log(authorMessageId, recipientId);

      const messagesRes = await UserService.updateMessageAsRead(
        authorMessageId,
        recipientId
      );

      if (messagesRes) {
        res.json(messagesRes);
      } else {
        res.status(404).json({ error: "Message not updated!" });
      }
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  getFriends: async (req, res) => {
    try {
      let friends = await UserService.getFriends(req.userId);

      res.json(friends);
    } catch (error) {
      throw new Error("Error sending message");
    }
  },
};
