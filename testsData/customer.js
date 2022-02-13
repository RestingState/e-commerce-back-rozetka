const registrationCorrect1 = {
  login: 'strawberry',
  password: 'qwerty123',
  name: 'Vladik',
  surname: 'Lavandos',
  phone: '+380992997523',
  email: 'lavandos@gmail.com'
};

const registrationCorrect2 = {
  login: 'blueberry',
  password: 'asdfgh123',
  name: 'Denys',
  surname: 'Zachar',
  phone: '+380663453423',
  email: 'zachar@gmail.com'
};

const registrationCorrect3 = {
  login: 'apple',
  password: 'zxcvb321',
  name: 'Augusto',
  surname: 'Alexus',
  phone: '+380991237645',
  email: 'augusto@gmail.com'
};

const registrationLoginAbsence = {
  password: 'qwerty123',
  name: 'Vladik',
  surname: 'Lavandos',
  phone: '+380992997523',
  email: 'lavandos@gmail.com'
};

const registrationPasswordAbsence = {
  login: 'strawberry',
  name: 'Vladik',
  surname: 'Lavandos',
  phone: '+380992997523',
  email: 'lavandos@gmail.com'
};

const registrationNameAbsence = {
  login: 'strawberry',
  password: 'qwerty123',
  surname: 'Lavandos',
  phone: '+380992997523',
  email: 'lavandos@gmail.com'
};

const registrationSurnameAbsence = {
  login: 'strawberry',
  password: 'qwerty123',
  name: 'Vladik',
  phone: '+380992997523',
  email: 'lavandos@gmail.com'
};

const registrationPhoneAbsence = {
  login: 'strawberry',
  password: 'qwerty123',
  name: 'Vladik',
  surname: 'Lavandos',
  email: 'lavandos@gmail.com'
};

const registrationEmailAbsence = {
  login: 'strawberry',
  password: 'qwerty123',
  name: 'Vladik',
  surname: 'Lavandos',
  phone: '+380992997523'
};

const registrationCustomerWithSuchLoginExists = {
  login: 'strawberry',
  password: 'qwerty123',
  name: 'Vladik',
  surname: 'Lavandos',
  phone: '+380662997523',
  email: 'august@gmail.com'
};

const registrationCustomerWithSuchPhoneExists = {
  login: 'blueberry',
  password: 'qwerty123',
  name: 'Vladik',
  surname: 'Lavandos',
  phone: '+380992997523',
  email: 'august@gmail.com'
};

const registrationCustomerWithSuchEmailExists = {
  login: 'blueberry',
  password: 'qwerty123',
  name: 'Vladik',
  surname: 'Lavandos',
  phone: '+380662997523',
  email: 'lavandos@gmail.com'
};

const loginCorrect1 = {
  login: 'strawberry',
  password: 'qwerty123'
};

const loginCorrect2 = {
  login: 'blueberry',
  password: 'asdfgh123'
};

const loginLoginFieldAbsence = {
  password: 'qwerty123'
};

const loginPasswordFieldAbsence = {
  login: 'strawberry'
};

const loginLoginIsIncorrect = {
  login: 'whatever',
  password: 'qwerty123'
};

const loginPasswordIsIncorrect = {
  login: 'strawberry',
  password: 'incorrect'
};

const incorrectToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

module.exports = {
  registrationCorrect1,
  registrationCorrect2,
  registrationCorrect3,
  registrationLoginAbsence,
  registrationPasswordAbsence,
  registrationNameAbsence,
  registrationSurnameAbsence,
  registrationPhoneAbsence,
  registrationEmailAbsence,
  registrationCustomerWithSuchLoginExists,
  registrationCustomerWithSuchPhoneExists,
  registrationCustomerWithSuchEmailExists,
  loginCorrect1,
  loginCorrect2,
  loginLoginFieldAbsence,
  loginPasswordFieldAbsence,
  loginLoginIsIncorrect,
  loginPasswordIsIncorrect,
  incorrectToken
};
