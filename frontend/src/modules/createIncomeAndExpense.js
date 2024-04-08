import {Sidebars} from "./sidebars.js";
import {GetCategory} from "../services/getCategory.js";
import dayjs from 'dayjs';
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class CreateIncomeAndExpense {
  constructor(category) {
    new Sidebars();

    const titleHTML = document.getElementById('main-header');
    const disagree = document.getElementById('disagree');

    this.typeSelect = document.getElementById('type');
    const incomeOption = document.getElementById('income');
    const expenseOption = document.getElementById('expense');

    if (category === 'income') {
      incomeOption.selected = true;
    } else if (category === 'expense') {
      expenseOption.selected = true;
    }

    this.typeSelect.disabled = true;
    titleHTML.innerText = document.title;

    // перенаправление на страницу
    disagree.onclick = () => {
      location.href = '#/operations'
    }

    this.createOperation().then();
    this.dataInit();
  }

  async dataInit() {
    await Sidebars.getBalance();
    this.categories = await this.getCategories(this.typeSelect.value);
  }

  // получение списка категорий в зависимости от выбранного типа операции
  async getCategories(type) {
    const options = [];

    const categories = await new GetCategory(type);

    const category = document.getElementById('category');
    const items = [...category.getElementsByTagName('option')];
    const filteredOptions = items.filter(item => item.id.includes('option_'));
    filteredOptions.forEach(item => item.remove());

    categories.forEach(item => {
      const option = document.createElement('option');
      option.setAttribute('id', 'option_' + item.id);
      option.setAttribute('value', item.title);
      option.innerText = item.title;
      options.push(option);
    });

    options.forEach(item => {
      category.appendChild(item);
    });

    return categories;
  }

  // создание информации об операции
  async createOperation() {
    let operation = {};
    const category = document.getElementById('category');
    const amount = document.getElementById('price');
    const date = document.getElementById('date');
    const comment = document.getElementById('comment');
    const agree = document.getElementById('agree');

    agree.setAttribute('disabled', 'disabled');

    // выбор категорий в зависимости от типа
    operation.type = this.typeSelect.value;
    this.typeSelect.style.color = 'black';

    category.onchange = () => {
      operation.categoryId = this.categories.find(item => item.title === category.value).id;
      operation.category = category.value;
      category.style.color = 'black';
      validation();
    };

    amount.oninput = () => {
      const inputValue = amount.value;
      const cleanedValue = inputValue.replace(/[^0-9]/g, '');
      amount.value = cleanedValue;
      operation.amount = Number(cleanedValue);
      validation();
    };

    date.oninput = () => {
      const inputValue = date.value;
      const parsedDate = dayjs(inputValue, 'YYYY-MM-DD');
      if (parsedDate.isValid()) {
        operation.date = parsedDate.format('YYYY-MM-DD');
      } else {
        operation.date = null;
      }
      validation();
    };

    comment.oninput = () => {
      const inputValue = comment.value;
      const cleanedValue = inputValue.replace(/[^a-zA-Zа-яА-ЯУЁё0-9,.!?/ ]/g, ''); // Оставить только буквенно-цифровые символы и знаки препинания
      comment.value = cleanedValue;
      operation.comment = cleanedValue;
      validation();
    };

    function validation() {
      agree.disabled = !(operation.type && operation.categoryId && operation.amount && operation.date && operation.comment);
    }

    // отправка созданной операции на сервер
    async function sendOperationToServer(operation) {
      try {
        const result = await CustomHttp.request(config.host + '/operations', "POST", {
          type: operation.type,
          category_id: operation.categoryId,
          amount: operation.amount,
          date: operation.date,
          comment: operation.comment
        });
        if (result) {
          location.href = '#/operations';
          if (!result) {
            new Sidebars();
            throw new Error(result.message);
          }
        }
      } catch (error) {
        return  console.log(error);
      }
    }

    // перенаправление на страницу
    agree.onclick = () => {
      sendOperationToServer(operation);
    }
  }
}