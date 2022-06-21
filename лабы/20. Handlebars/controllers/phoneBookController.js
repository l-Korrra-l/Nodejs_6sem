const fs = require("fs");
module.exports = {
  get() {
    return JSON.parse(fs.readFileSync("./phoneBook.json"));
  },

  add(contact) {
    let phoneBook = new Array();
    phoneBook = this.get();
    if (phoneBook.find((obj) => obj.number == contact.number)) {
      return false;
    }

    phoneBook.push(contact);

    renewPhoneBook(phoneBook);
    return true;
  },

  update(contact) {
    try {
      let phoneBook = this.get();

      const chckedNumber = phoneBook.find(
        (obj) => obj.number == contact.number
      );
      if (chckedNumber && chckedNumber.number != contact.previousNumber) {
        return false;
      }

      const index = phoneBook.findIndex(
        (obj) => obj.number == contact.previousNumber
      );

      phoneBook[index] = {
        name: contact.name,
        number: contact.number,
      };

      renewPhoneBook(phoneBook);

      return true;
    } catch (err) {
      console.error(err);
    }
  },

  delete(number) {
    let phoneBook = this.get();
    const index = phoneBook.findIndex((obj) => obj.number == number);

    if (!index) {
      return false;
    }

    phoneBook.splice(index, 1);
    renewPhoneBook(phoneBook);
    return true;
  },
};

const renewPhoneBook = (phoneBook) => {
  fs.writeFileSync("./phoneBook.json", JSON.stringify(phoneBook));
};
