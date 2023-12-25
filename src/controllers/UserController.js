const UserService = require("../services/UserService");
const userService = require("../services/UserService");

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

      if (email && password) {
        let user = await UserService.register(email, password);
        json.result = user;
      } else {
        json.error = "Fields not filled in";
      }
      res.json(json);
    } catch (error) {
    }
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

    try {
      let user = await UserService.login(email, password);

      if (user) {
        // user.loggedIn = true;
        json.result = user;
      } else {
        json.result = loggedIn;
      }
      res.json(json);
    } catch (error) {
      json.error = "An error occurred during login";
      res.status(500).json(json);
    }
  },
};