import {Sidebars} from "./sidebars.js";
import {GetCategory} from "../services/getCategory.js";
import {Popup} from "./popap.js";

export class IncomeCategories {
  constructor() {
    this.title = document.getElementById('main-header');
    this.category = document.getElementById('category');
    const urlRoute = window.location.hash.split('?')[0];

    if (urlRoute === '#/incomes') {
      this.title.innerText = 'Доходы';
      this.createCategoriesTable('income').then(() => new Popup('income'));
    }

    if (urlRoute === '#/expenses') {
      this.title.innerText = 'Расходы';
      this.createCategoriesTable('expense').then(() => new Popup('expense'));
    }

    new Sidebars();
  }

  // создание категорий доходов или расходов в зависимости от переданного аргумента categories
  async createCategoriesTable(categories) {
    await Sidebars.getBalance(); // запрос на баланс
    let categoriesList = await new GetCategory(categories);
    let tableCat = '';
    const createCat = `<div class="category-item add-category-item" id="add-category-item">+</div>`

    categoriesList.forEach(a => {
      const categoryHTML =
        `<div class="category-item" id="categoryItem">
         <div class="category-item-title" id="categoryItemTitle">${a.title}</div>
           <div class="category-item-action">
             <button class="btn edit-category">Редактировать</button>
             <button class="btn delete-category">Удалить</button>
           </div>
         </div>`;
      tableCat += categoryHTML;
    });

    this.category.innerHTML = tableCat + createCat;
    this.changePage(categories);
  }

  changePage(categories) {
    const createBtn = document.getElementById('add-category-item');

    if (categories === 'income') {
      createBtn.onclick = () => location.href = "#/createIncCat";
    }

    if (categories === 'expense') {
      createBtn.onclick = () => location.href = "#/createExpCat";
    }
  }
}