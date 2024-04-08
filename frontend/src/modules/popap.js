import {GetCategory} from "../services/getCategory.js";
import {IncomeCategories} from "./incomeCategories.js";
import {GetOperation} from "../services/getOperation.js";
import {CustomHttp} from "../services/custom-http.js";
import {Sidebars} from "./sidebars.js";
import config from "../../config/config.js";

export class Popup {
  constructor(category) {
    const that = this;
    this.openPopup(that, category).then();

    new Sidebars();
  }

  // открывает попап окно при нажатии на кнопку delete-category
  async openPopup(item, categories) {
    const urlRoute = window.location.hash.split('?')[0];
    const popup = document.getElementById('popup');
    const agree = document.getElementById('agree');
    const disagree = document.getElementById('disagree');
    const openButtons = document.getElementsByClassName('delete-category');
    const changeButtons = document.getElementsByClassName('edit-category');
    let categoryId = '';
    let categoryTitle = '';
    let categoriesList = await new GetCategory(categories);


    function closePopup() {
      popup.style.display = 'none';
      categoryId = '';
      categoryTitle = '';
    }

    for (let i = 0; i < openButtons.length; i++) {
      openButtons[i].onclick = function () {
        popup.style.display = 'flex';
        categoryId = categoriesList[i].id;
        categoryTitle = categoriesList[i].title;

        if (urlRoute === '#/incomes') {
          agree.onclick = () => {
            item.deleteOperations(categoryTitle).then(() => deleteInc());
          }
        }
        if (urlRoute === '#/expenses') {
          agree.onclick = () => {
            item.deleteOperations(categoryTitle).then(() => deleteExp());
          };
        }
      };
    }

    for (let i = 0; i < changeButtons.length; i++) {
      changeButtons[i].onclick = function () {
        categoryId = categoriesList[i].id;
        categoryTitle = categoriesList[i].title;

        if (urlRoute === '#/incomes') {
          location.href = '#/changeIncCat?' + categoryId;
        }
        if (urlRoute === '#/expenses') {
          location.href = '#/changeExpCat?' + categoryId;
        }
      };
    }

    disagree.addEventListener("click", closePopup);

    function deleteExp() {
      item.deleteCategory('/categories/expense/' + categoryId)
        .then(() => closePopup())
        .then(() => new IncomeCategories())
    }

    function deleteInc() {
      item.deleteCategory('/categories/income/' + categoryId)
        .then(() => closePopup())
        .then(() => new IncomeCategories())
    }
  }

  // запрос на удаление категории
  async deleteCategory(urlRoute) {
    try {
      const result = await CustomHttp.request(config.host + urlRoute, 'DELETE');
      if (result) {
        if (!result) {
          throw new Error(result.message);
        }
      }
    } catch (error) {
      return console.log(error);
    }
  }

  // удаление всех операций, связанных с заданной категорией
  async deleteOperations(categoryTitle) {
    let operations = await new GetOperation('all');
    const deleteCategory = operations.filter(operation => operation.category === categoryTitle);

    deleteCategory.forEach(item => deleteOperation(item.id));

    async function deleteOperation(id) {
      try {
        const result = await CustomHttp.request(config.host + '/operations/' + id, 'DELETE');
        if (result) {
          if (!result) {
            throw new Error(result.message);
          }
        }
      } catch (error) {
        return console.log(error);
      }
    }
  }
}