import {Sidebars} from "./sidebars.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import dayjs from 'dayjs';
import {GetCategory} from "../services/getCategory.js";

export class ChangeIncomeAndExpense {
  constructor() {
    new Sidebars();

    const titleHTML = document.getElementById('main-header');
    const disagree = document.getElementById('disagree');

    const id = window.location.hash.split('?')[1]; // получение значения id из текущего URL-адреса

    titleHTML.innerText = 'Редактирование дохода/расхода';

    // перенаправление на страницу
    disagree.onclick = () => {
      location.href = '#/operations'
    }

    this.loadOperation(this, id).then();
  }

  // загрузка информации об операции
  async loadOperation(that, id) {
    await Sidebars.getBalance(); // запрос на баланс
    const operation = await CustomHttp.request(config.host + '/operations/' + id); // запрос на сервер

    const type = document.getElementById('typeName');
    const income = document.getElementById('income');
    const expense = document.getElementById('expense');
    const price = document.getElementById('price');
    const date = document.getElementById('date');
    const comment = document.getElementById('comment');
    let categories;

    if (operation.type === 'income') {
      type.removeAttribute('selected');
      income.setAttribute('selected', 'selected');
    } else if (operation.type === 'expense') {
      type.removeAttribute('selected');
      expense.setAttribute('selected', 'selected');
    }

    type.value = operation.type;
    categories = await that.getCat(type.value, operation); // получение списка категорий
    price.value = operation.amount + ' $';
    date.value = dayjs(operation.date).format('DD.MM.YYYY');
    comment.value = operation.comment;

    that.changeOperation(that, operation, categories);
  }

  // обрабатывает изменения операции и обновляет соответствующие значения
  async changeOperation(that, operation, categories) {
    const type = document.getElementById('type');
    const category = document.getElementById('category');
    const amount = document.getElementById('price');
    const date = document.getElementById('date');
    const comment = document.getElementById('comment');
    const agree = document.getElementById('agree');

    // выбор операции
    type.onchange = async () => {
      if (type.value !== "Тип..") {
        operation.type = type.value;
        type.style.color = 'black';
        categories = await that.getCat(type.value, operation);
      }
    };

    const selectedCategory = categories.find(item => item.title === category.value);
    operation.categoryId = selectedCategory.id;

    category.onchange = () => {
      operation.categoryId = categories.find(item => item.title === category.value).id;
      category.style.color = 'black';
    }

    amount.onchange = () => {
      operation.amount = Number(amount.value.split(' ')[0]);
    };

    date.onchange = () => {
      operation.date = dayjs(date.value, 'YYYY-MM-DD').format('YYYY-MM-DD');
    };

    comment.onchange = () => {
      operation.comment = comment.value;
    };

    // отправка обновленной операции на сервер
    async function updateOperation(operation) {
      try {
        const result = await CustomHttp.request(config.host + '/operations/' + operation.id, "PUT", {
          type: operation.type,
          category_id: operation.categoryId,
          amount: operation.amount,
          date: operation.date,
          comment: operation.comment
        })
        if (result) {
          location.href = '#/operations';
          if (!result) {
            new Sidebars();
            throw new Error(result.message);
          }
        }
      } catch (error) {
        return console.log(error);
      }
    }

    // перенаправление на страницу
    agree.onclick = () => {
      updateOperation(operation);
    }
  }

  // получение списка категорий в зависимости от выбранного типа операции
  async getCat(type, operation) {
    const category = document.getElementById('category');

    let options = [];

    const categories = await new GetCategory(type);

    if (category) {
      const items = document.getElementsByTagName('option');
      const newItems = [];
      for (let arr of items) {
        newItems.push(arr);
      }
      const filteredOptions = newItems.filter(item => item.id.includes('option_'));
      filteredOptions.forEach(item => item.remove());
    }

    const optionFirst = document.getElementById('option');
    optionFirst.removeAttribute('selected');

    categories.forEach(item => {
      const option = document.createElement('option');
      if (item.title === operation.category) {
        option.setAttribute('selected', 'selected');
      }
      option.setAttribute('id', 'option_' + item.id);
      option.setAttribute('value', item.title);
      option.innerText = item.title;
      options.push(option);
    })

    options.forEach(item => {
      category.appendChild(item);
    })

    return categories;
  }
}