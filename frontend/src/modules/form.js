import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Form {
  constructor(page) {
    this.agreeElement = null;
    this.processElement = null;
    this.page = page;

    const accessToken = localStorage.getItem(Auth.accessTokenKey);

    if (accessToken) {
      location.href = '/#/main';
      return;
    }

    this.fields = [
      {
        name: "email",
        id: "email",
        element: null,
        regex: /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,4}$/,
        valid: false,
      },
      {
        name: "password",
        id: "password",
        element: null,
        regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/,
        valid: false,
      },
    ];

    if (this.page === 'signup') {
      this.fields.unshift({
        name: "name",
        id: "name",
        element: null,
        regex: /^[A-ЯЁA-Z][а-яёa-z]+\s[A-ЯЁA-Z][а-яёa-z]+$/,
        valid: false,
      });

      this.fields.push({
        name: "passwordRepeat",
        id: "password-repeat",
        element: null,
        regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/,
        valid: false,
      });
    }

    const that = this;

    this.fields.forEach(item => {
      item.element = document.getElementById(item.id);
      item.element.onchange = function () {
        that.validateField.call(that, item, this);
      };
    });

    this.processElement = document.getElementById('process');
    this.processElement.onclick = function () {
      that.processForm();
    }

    // if (this.page === 'login') {
    //   this.agreeElement = document.getElementById('remember');
    //   this.agreeElement.onchange = function () {
    //     that.validateForm();
    //   }
    // }
  }

  // проверка валидности полей
  validateField(field, element) {
    if (!element.value || !element.value.match(field.regex)) {
      element.style.borderColor = 'red';
      element.parentNode.style.marginBottom = '0';
      field.valid = false;
      document.getElementById(`${element.id}-error`).style.display = 'block';
    } else {
      element.removeAttribute('style');
      element.parentNode.style.marginBottom = '10px';
      field.valid = true;
      document.getElementById(`${element.id}-error`).style.display = 'none';
    }

    if (this.page === 'signup' && field.name === 'passwordRepeat') {
      const passwordField = this.fields.find(item => item.name === 'password');
      const passwordElement = passwordField.element;
      const passwordValue = passwordElement.value;

      if (passwordValue && element.value !== passwordValue) {
        element.style.borderColor = 'red';
        element.parentNode.style.marginBottom = '0';
        field.valid = false;
        document.getElementById(`${element.id}-error`).style.display = 'block';
      }
    }

    this.validateForm();
  }

  // проверка валидности формы
  validateForm() {
    const validForm = this.fields.every(item => item.valid);
    // const isValid = this.agreeElement ? this.agreeElement.checked && validForm : validForm;
    if (validForm) {
      this.processElement.removeAttribute('disabled');
    } else {
      this.processElement.setAttribute('disabled', 'disabled');
    }
    return validForm;
  }

  // обработка формы при отправке
  async processForm() {
    if (this.validateForm()) {
      const email = this.fields.find(item => item.name === 'email').element.value;
      const password = this.fields.find(item => item.name === 'password').element.value;

      if (this.page === 'signup') {
        const name = this.fields.find(item => item.name === 'name').element.value.split(' ')[0];
        const lastName = this.fields.find(item => item.name === 'name').element.value.split(' ')[1];
        const passwordRepeat = this.fields.find(item => item.name === 'passwordRepeat').element.value;

        if (password !== passwordRepeat) {
          const passwordRepeatElement = this.fields.find(item => item.name === 'passwordRepeat').element;
          passwordRepeatElement.style.borderColor = 'red';
          passwordRepeatElement.parentNode.style.marginBottom = '0';
          this.fields.find(item => item.name === 'passwordRepeat').valid = false;
          document.getElementById(`${passwordRepeatElement.id}-error`).style.display = 'block';
          return;
        }

        try {
          const result = await CustomHttp.request(config.host + '/signup', 'POST', {
            name: name,
            lastName: lastName,
            email: email,
            password: password,
            passwordRepeat: passwordRepeat,
          });

          if (result) {
            if (!result.user) {
              throw new Error(result.message);
            }
          }
        } catch (error) {
          return console.log(error);
        }
      }

      this.agreeElement = document.getElementById('remember');
      let rememberMe = false;
      if (this.page === 'login' && this.agreeElement) {
        rememberMe = this.agreeElement.checked;
      }

      try {
        const result = await CustomHttp.request(config.host + '/login', 'POST', {
          email: email,
          password: password,
          rememberMe: rememberMe,
        });

        if (result) {
          if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user.name || !result.user.lastName || !result.user.id) {
            throw new Error(result.message);
          }

          Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
          Auth.setUserInfo({
            name: result.user.name,
            lastName: result.user.lastName,
            userId: result.user.id,
            email: email,
          });

          location.href = '/#/main';
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}