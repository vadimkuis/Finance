import {Auth} from "../services/auth.js";
import config from "../../config/config.js";
import {CustomHttp} from "../services/custom-http.js";

export class Sidebars {
  constructor() {
    const mainBtn = document.getElementById('mainBtn');
    const allBtn = document.getElementsByClassName('sidebar-link');
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdownBtn = document.getElementById('dropdown-button');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const incomesBtn = document.getElementById('catIncomesBtn');
    const expenseBtn = document.getElementById('catExpenseBtn');
    const incExpBtn = document.getElementById('incomesExpenseBtn');
    const profileNameElement = document.getElementById('userName');
    const imageUser = document.getElementById('user-image');
    const logout = document.getElementById('logout');
    const urlRoute = window.location.hash.split('?')[0];

    const userInfo = Auth.getUserInfo();

    const accessToken = localStorage.getItem(Auth.accessTokenKey);

    // пользователь
    if (userInfo && accessToken) {
      profileNameElement.innerText = `${userInfo.name} ${userInfo.lastName}`;
    }

    dropdownMenu.style.display = 'none';
    dropdownBtn.style.transform = 'rotate(-90deg)';
    logout.style.display = 'none';

    // соответствие между URL-путями и кнопками на странице
    const routeButtonMap = {
      "#/main": mainBtn,
      "#/operations": incExpBtn,
      "#/incomes": incomesBtn,
      "#/expenses": expenseBtn,
      "#/createOperation/income": incExpBtn,
      "#/createIncCat": incomesBtn,
      "#/createExpCat": expenseBtn,
      "#/changeIncCat": incomesBtn,
      "#/changeExpCat": expenseBtn,
    };

    // проверка URL-пути
    if (routeButtonMap[urlRoute]) {
      setActiveButton(routeButtonMap[urlRoute]);
    }

    // функция устанавливает класс "active" переданной кнопке и удаляет этот класс у всех остальных кнопок
    function setActiveButton(btn) {
      for (let i = 0; i < allBtn.length; i++) {
        if (allBtn[i].classList.contains('active')) {
          allBtn[i].classList.remove("active");
        }
      }
      btn.classList.add('active');
      if (btn === incomesBtn || btn === expenseBtn) {
        dropdownToggle.classList.add('active');
        dropdownMenu.style.display = 'flex';
        dropdownMenu.style.flexDirection = 'column';
        dropdownBtn.style.transform = 'rotate(0deg)';
      }
    }

    function toggleDropdownMenu() {
      if (dropdownToggle.classList.contains('active')) {
        dropdownToggle.classList.remove('active');
        dropdownMenu.style.display = 'none';
        dropdownBtn.style.transform = 'rotate(-90deg)';
      } else {
        dropdownToggle.classList.add('active');
        dropdownMenu.style.display = 'flex';
        dropdownMenu.style.flexDirection = 'column';
        dropdownBtn.style.transform = 'rotate(0deg)';
      }
    }

    mainBtn.onclick = () => {
      location.href = '#/main';
    };

    incExpBtn.onclick = () => {
      location.href = '#/operations';
    };

    incomesBtn.onclick = () => {
      location.href = '#/incomes';
    };
    expenseBtn.onclick = () => {
      location.href = '#/expenses';
    };

    dropdownToggle.onclick = () => {
      toggleDropdownMenu();
    }

    imageUser.onclick = () => {
      if (logout.style.display !== 'flex') {
        logout.style.display = 'flex'
      } else {
        logout.style.display = 'none'
      }
    }

    logout.onclick = () => {
      location.href = '#/logout'
    }
  }

  // запрос баланса
  static async getBalance() {
    const balanceProfile = document.getElementById('balance');
    try {
      const response = await CustomHttp.request(config.host + '/balance');
      if (response) {
        balanceProfile.innerText = response.balance;
        return response;
      } else {
        balanceProfile.innerText = 0;
        return 0;
      }
    } catch (error) {
      console.log(error);
    }
  }
}