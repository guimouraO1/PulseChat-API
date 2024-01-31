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
      9;
      res.status(500).json({ error: "Internal Server Error", result: {} });
    }
  },

  register: async (req, res) => {
    try {
      let email = req.body.email;
      let password = req.body.password;
      let confirmPassword = req.body.confirmPassword;

      if (!email) {
        return res.status(422).json({ msg: "O email é obrigatório" });
      }
      if (!password) {
        return res.status(422).json({ msg: "O password é obrigatório" });
      }
      if (password !== confirmPassword) {
        return res.status(422).json({ msg: "As senhas não conferem" });
      }

      const userExists = await UserService.getUserByEmail(email);
      if (userExists) {
        return res
          .status(422)
          .json({ msg: "Email já cadastrado, tente outro." });
      }

      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      let user = await UserService.register(email, passwordHash);

      res.json(user);
    } catch (error) {}
  },

  update: async (req, res) => {
    try {
      let id = req.userId;
      let first_name = req.body.first_name;
      let last_name = req.body.last_name;
      let admin = req.body.admin;

      if (id) {
        await UserService.update(id, first_name, last_name, admin);
        result = {
          update: true,
        };
      }
      res.json(result);
    } catch (error) {
      error.status(404).json({ msg: "Id not found" });
    }
  },

  delete: async (req, res) => {
    try {
      await UserService.delete(req.params.id);

      res.json({ userId: req.params.id, delete: true });
    } catch (error) {
      res.status(500).json({
        error: "Internal Server Error",
        result: { userId: req.params.id, delete: false },
      });
    }
  },

  login: async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatório" });
    }
    if (!password) {
      return res.status(422).json({ msg: "O password é obrigatório" });
    }

    const userExists = await UserService.getUserByEmail(email);
    if (!userExists) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    const checkPassword = await bcrypt.compare(password, userExists.password);
    if (!checkPassword) {
      return res.status(422).json({ msg: "Senha inválida!" });
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
