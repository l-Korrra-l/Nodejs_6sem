let phoneBook = require("../controllers/phoneBookController");

module.exports = {
  returnViewIndex(req, res) {
    res.render("index", {
      numbers: phoneBook.get(),
    });
  },

  returnViewAdd(req, res) {
    res.render("add", {
      layout: false,
      numbers: phoneBook.get(),
    });
  },

  returnViewUpdate(req, res) {
    res.render("update", {
      layout: false,
      numbers: phoneBook.get(),
      name: req.params.name,
      number: req.params.number,
    });
  },

  addNumber(req, res) {
    if (phoneBook.add(req.body)) {
      res.redirect("/");
      return;
    }
    res.sendStatus(400);
  },

  updateNumber(req, res) {
    if (phoneBook.update(req.body)) {
      res.redirect("/");
      return;
    }
    res.sendStatus(400);
  },

  deleteNumber(req, res) {
    if (phoneBook.delete(req.params.number)) {
      res.redirect("/");
      return;
    }
    res.sendStatus(400);
  },
};
