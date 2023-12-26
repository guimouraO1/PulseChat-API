const UserService = require("../services/UserService");
const userService = require("../services/UserService");
const bcrypt = require("bcryptjs");

module.exports = {
  findAll: async (req, res) => {
    try {
      let json = { error: "", result: [] };

      let users = await userService.findAll();

      for (let i in users) {
        json.result.push({
          id: users[i].id,
          email: users[i].email,
        });
      }
      res.json(json);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", result: [] });
    }
  },

  findOne: async (req, res) => {
    try {
      let json = { error: "", result: {} };

      let email = req.body.email;
      let user = await UserService.findOne(email);

      if (user) {
        json.result = user;
      }
      res.json(json);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", result: {} });
    }
  },

  register: async (req, res) => {
    try {
      let json = { error: "", result: {} };

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

      const userExists = await UserService.findOne(email);
      if (userExists) {
        return res
          .status(422)
          .json({ msg: "Email já cadastrado, tente outro." });
      }

      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      let user = await UserService.register(email, passwordHash);
      json.result = user;

      res.json(json);
    } catch (error) {}
  },

  update: async (req, res) => {
    try {
      let json = { error: "", result: {} };

      let id = req.params.id;
      let email = req.body.email;
      let password = req.body.password;

      if (id && email && password) {
        await UserService.update(id, email, password);
        json.result = {
          id,
          email,
          password,
        };
      } else {
        json.error = "Fields not filled in";
      }
      res.json(json);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", result: {} });
    }
  },

  delete: async (req, res) => {
    try {
      let json = { error: "", result: {} };

      await UserService.delete(req.params.id);

      res.json(json);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", result: {} });
    }
  },

  login: async (req, res) => {
    let json = { error: "", result: {} };

    let email = req.body.email;
    let password = req.body.password;
    let loggedIn = { loggedIn: false };
    // Validations
    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatório" });
    }
    if (!password) {
      return res.status(422).json({ msg: "O password é obrigatório" });
    }

    const userExists = await UserService.findOne(email);
    if (!userExists) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    const checkPassword = await bcrypt.compare(password, userExists.password);
    if (!checkPassword) {
      return res.status(422).json({ msg: "Senha inválida!" });
    }

    try {
      let user = await UserService.login(email, userExists.password);

      user.user.loggedIn = true;
      json.result = user;
      res.json(json);
    } catch (error) {
      json.error = "An error occurred during login";
      res.status(500).json(json);
    }
  },



};
