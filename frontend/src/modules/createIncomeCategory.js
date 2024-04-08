import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Sidebars} from "./sidebars";

export class CreateIncomeCategory {
  constructor() {
    this.title = document.getElementById('main-header');
    const agreeBtn = document.getElementById('agree');
    const disagreeBtn = document.getElementById('disagree');
    const urlRoute = window.location.hash.split('?')[0];
    const that = this;

    this.dataInit().then(() => {
      if (urlRoute === '#/createIncCat') {
        this.title.innerText = 'Создание категории доходов';
        agreeBtn.onclick = createInc;
        disagreeBtn.onclick = () => {
          location.href = '#/incomes'
        };
      } else if (urlRoute === '#/createExpCat') {
        this.title.innerText = 'Создание категории расходов';
        agreeBtn.onclick = createExp;
        disagreeBtn.onclick = () => {
          location.href = '#/expenses'
        };
      }
    });

    function createExp() {
      that.createCategory('/categories/expense').then(() => {
        location.href = '#/expenses';
      });
    }

    function createInc() {
      that.createCategory('/categories/income').then(() => {
        location.href = '#/incomes';
      });
    }

    new Sidebars();
  }

  async dataInit() {
    await Sidebars.getBalance();
  }

  // отправка запроса для создания новой категории
  async createCategory(urlRoute) {
    const categoryName = document.getElementById('name').value;

    try {
      const result = await CustomHttp.request(config.host + urlRoute, 'POST', {
        title: categoryName
      });

      if (!result) {
        throw new Error(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
}