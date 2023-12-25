const UserService = require("../services/UserService");
const userService = require("../services/UserService");

module.exports = {
  findAll: async (req, res) => {
    let json = { error: "", result: [] };

    let users = await userService.findAll();

    for (let i in users) {
      json.result.push({
        id: users[i].id,
        email: users[i].email,
      });
    }
    res.json(json);
  },

  findOne: async (req, res) => {
    let json = { error: "", result: {} };

    let email = req.body.email;
    let user = await UserService.findOne(email);

    if (user) {
      json.result = user;
    }
    res.json(json);
  },

  register: async (req, res) => {
    let json = { error: "", result: {} };

    let email = req.body.email;
    let password = req.body.password;

    if (email && password) {
      let user = await UserService.register(email, password);
      json.result = {
        id: user,
        email,
        password,
      };
    } else {
      json.error = "Fields not filled in";
    }
    res.json(json);
  },

  update: async (req, res) => {
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
  },

  delete: async (req, res) => {
    let json = { error: "", result: {} };

    await UserService.delete(req.params.id);

    res.json(json);
  },

  login: async (req, res) => {
    let json = { error: "", result: {} };

    let email = req.body.email;
    let password = req.body.password;
    let loggedIn = { loggedIn: false };

    try {
      let user = await UserService.login(email, password);

      if (user) {
        user.loggedIn = true;
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
