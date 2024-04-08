import {Sidebars} from "./sidebars.js";
import {Chart} from "chart.js/auto";
import {Filters} from "../services/fillter.js";
import dayjs from "dayjs";

export class Main {
  constructor() {
    this.today = document.getElementById("today");
    this.week = document.getElementById("week");
    this.month = document.getElementById("month");
    this.year = document.getElementById("year");
    this.all = document.getElementById("all");
    this.interval = document.getElementById("interval");
    this.allBtns = document.querySelectorAll(".table-btn");

    this.addEventListeners();
    this.setActiveButton(this.today);
    this.performButtonClick("today");
    new Sidebars;
  }

  // вызов соответствующего метод
  addEventListeners() {
    this.today.onclick = async () => {
      this.setActiveButton(this.today);
      await this.performButtonClick("today");
    };

    this.week.onclick = async () => {
      this.setActiveButton(this.week);
      await this.performButtonClick("week");
    };

    this.month.onclick = async () => {
      this.setActiveButton(this.month);
      await this.performButtonClick("month");
    };

    this.year.onclick = async () => {
      this.setActiveButton(this.year);
      await this.performButtonClick("year");
    };

    this.all.onclick = async () => {
      this.setActiveButton(this.all);
      await this.performButtonClick("all");
    };

    this.interval.onclick = async () => {
      this.setActiveButton(this.interval);

      const from = document.getElementById("dateFrom");
      const to = document.getElementById("dateTo");

      const dateFrom = dayjs(from.value, "DD.MM.YYYY").format("YYYY-MM-DD");
      const dateTo = dayjs(to.value, "DD.MM.YYYY").format("YYYY-MM-DD");

      await this.performButtonClick("interval", dateFrom, dateTo);
    };
  }

  setActiveButton(btn) {
    this.allBtns.forEach((button) => button.classList.remove("active"));
    btn.classList.add("active");
  }

  // построение диаграмм в зависимости от периода
  async performButtonClick(period, from, to) {
    await Sidebars.getBalance(); // запрос на баланс
    const getData = await new Filters(period, from, to);
    const [incomesCategories, incomesData, expenseCategories, expensesData] = getData;

    const incomes = document.getElementById("categoryIncomes");
    const expenses = document.getElementById("categoryExpense");

    incomes.innerHTML = `<h2 class="charts-title">Доходы</h2>`;
    incomes.appendChild(createChart("catIncomes", incomesCategories, incomesData));
    expenses.innerHTML = `<h2 class="charts-title">Расходы</h2>`;
    expenses.appendChild(createChart("catExpenses", expenseCategories, expensesData));

    function createChart(id, categories, data) {
      const canvas = document.createElement("canvas");
      const colorPalette = ["#DC3545", "#FD7E14", "#FFC107", "#20C997", "#0D6EFD"];
      const backgroundColor = colorPalette.concat(generateRandomColors(categories.length - colorPalette.length));

      const config = {
        type: "pie",
        data: {
          labels: categories,
          datasets: [
            {
              data: data,
              label: "$",
              borderWidth: 1,
              backgroundColor: backgroundColor,
            },
          ],
        },
        options: {
          devicePixelRatio: 4,
          plugins: {
            legend: {
              labels: {
                font: {
                  weight: 500,
                },
                color: "#000000",
              },
            },
          },
        },
      };

      initializeChart(canvas, config);

      return canvas;
    }

    function generateRandomColors(count) {
      const randomColors = [];

      for (let i = 0; i < count; i++) {
        const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
        randomColors.push(color);
      }

      return randomColors;
    }

    function initializeChart(chartElement, config) {
      return new Chart(chartElement, config);
    }
  }
}