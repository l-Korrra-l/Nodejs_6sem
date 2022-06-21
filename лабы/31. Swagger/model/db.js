const fs = require('fs');
let phoneNumbers = require('./data/phoneNumbers');

function commit() {
    fs.writeFile(__dirname + '/data/phoneNumbers.json', JSON.stringify(phoneNumbers, null, '  '), err => {
        if (err) {throw err;}
    });
}

module.exports =
    {
    GetAll: () => {return phoneNumbers},

    Add(field)
    {
        const {name, number} = field;
        if (name && number)
        {
          phoneNumbers.push(
          {
              name,
              number
          });
          commit();
          return 1;
        }
        return 0;
    },

    Update(field)
    {
        const {name, number} = field;

        if (name, number)
        {
          let isNumber = phoneNumbers.find(phone => phone.number == number);
          if (!isNumber)
          {
            throw new Error('Phone number is not exists');
          }

          isNumber.name = name;
          isNumber.number = number;

          commit();
          return 1;
        }
        return 0;
    },

    Delete(number)
    {
        if(number)
        {
            let isNumber = phoneNumbers.find(phone => phone.number == number);

            if (!isNumber)
            {
                throw new Error('Phone number is not exists');
            }
            phoneNumbers = phoneNumbers.filter(phone => phone.number != number);
            commit();
            return 1;
        }
        return 0;
    }
};
