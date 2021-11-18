// Reference:
// 1. https://robferguson.org/blog/2017/11/20/ionic-3-and-forms-part-2/
// 2. https://ionicthemes.com/tutorials/about/forms-and-validation-in-ionic
// See: EMAIL_REGEXP from https://github.com/angular/angular.js/blob/ffb6b2fb56d9ffcb051284965dd538629ea9687a/src/ng/directive/input.js#L16
const PURE_EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const PURE_URL_REGEX = /(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

// Passwords should be at least 8 characters long and should contain one number, one character and one special character.
const PASSWORD_REGEXP = /^(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
// const PASSWORD_REGEXP = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

const NUMBER_REGEXP = /^([0-9]*)$/;
// const NUMBER_REGEXP =" '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/";

export const regexValidators = {
  email: PURE_EMAIL_REGEXP,
  url: PURE_URL_REGEX,
  password: PASSWORD_REGEXP,
  number: NUMBER_REGEXP
};
