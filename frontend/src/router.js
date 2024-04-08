import {Form} from "./modules/form.js";
import {Main} from "./modules/main.js";
import {Auth} from "./services/auth.js";
import {TableIncomeAndExpense} from "./modules/tableIncomeAndExpense.js";
import {IncomeCategories} from "./modules/incomeCategories.js";
import {ChangeIncomeAndExpense} from "./modules/changeIncomeAndExpense.js";
import {CreateIncomeCategory} from "./modules/createIncomeCategory.js";
import {CreateIncomeAndExpense} from "./modules/createIncomeAndExpense.js";
import {ChangeIncomeCategory} from "./modules/changeIncomeCategory.js";

export class Router {
  constructor() {
    this.contentElement = document.getElementById('content');
    this.stylesElement = document.getElementById('styles');
    this.titleElement = document.getElementById('title');


    this.routes = [
      {
        route: '#/',
        title: 'Авторизация',
        template: 'templates/login.html',
        styles: 'styles/login.css',
        load: () => {
          new Form('login');
        }
      },
      {
        route: '#/signup',
        title: 'Регистрация',
        template: 'templates/signup.html',
        styles: 'styles/login.css',
        load: () => {
          new Form('signup');
        }
      },
      {
        route: '#/main',
        title: 'Главная',
        template: 'templates/main.html',
        styles: 'styles/main.css',
        load: () => {
          new Main();
        }
      },
      {
        route: '#/incomes',
        title: 'Доходы',
        template: 'templates/incomeCategories.html',
        styles: 'styles/incomeCategories.css',
        load: () => {
          new IncomeCategories();
        }
      },
      {
        route: '#/createIncCat',
        title: 'Создание категории доходов',
        template: 'templates/createIncomeCategory.html',
        styles: 'styles/createIncomeCategory.css',
        load: () => {
          new CreateIncomeCategory();
        }
      },
      {
        route: '#/expenses',
        title: 'Расходы',
        template: 'templates/incomeCategories.html',
        styles: 'styles/incomeCategories.css',
        load: () => {
          new IncomeCategories();
        }
      },
      {
        route: '#/createExpCat',
        title: 'Создание категории расходов',
        template: 'templates/createIncomeCategory.html',
        styles: 'styles/createIncomeCategory.css',
        load: () => {
          new CreateIncomeCategory();
        }
      },
      {
        route: '#/changeIncCat',
        title: 'Редактирование категории доходов',
        template: 'templates/createIncomeCategory.html',
        styles: 'styles/createIncomeCategory.css',
        load: () => {
          new ChangeIncomeCategory();
        }
      },
      {
        route: '#/changeExpCat',
        title: 'Редактирование категории расходов',
        template: 'templates/createIncomeCategory.html',
        styles: 'styles/createIncomeCategory.css',
        load: () => {
          new ChangeIncomeCategory();
        }
      },
      {
        route: '#/operations',
        title: 'Доходы и Расходы',
        template: 'templates/tableIncomeAndExpense.html',
        styles: 'styles/tableIncomeAndExpense.css',
        load: () => {
          new TableIncomeAndExpense();
        }
      },
      {
        route: '#/createOperation/income',
        title: 'Создание дохода',
        template: 'templates/incomeAndExpense.html',
        styles: 'styles/incomeAndExpense.css',
        load: () => {
          new CreateIncomeAndExpense('income');
        }
      },
      {
        route: '#/createOperation/expense',
        title: 'Создание расхода',
        template: 'templates/incomeAndExpense.html',
        styles: 'styles/incomeAndExpense.css',
        load: () => {
          new CreateIncomeAndExpense('expense');
        }
      },
      {
        route: '#/changeOperation',
        title: 'Редактирование дохода/расхода',
        template: 'templates/incomeAndExpense.html',
        styles: 'styles/incomeAndExpense.css',
        load: () => {
          new ChangeIncomeAndExpense();
        }
      },
    ]
  }

  async openRoute() {
    const urlRoute = window.location.hash.split('?')[0];

    if (urlRoute === '#/logout') {
      await Auth.logout();
      window.location.href = '#/';
      return;
    }

    const newRoute = this.routes.find(item => {
      return item.route === urlRoute;
    })

    if (!newRoute) {
      window.location.href = '#/';
      return;
    }

    this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
    this.stylesElement.setAttribute('href', newRoute.styles);
    this.titleElement.innerText = newRoute.title;

    newRoute.load();
  }
}