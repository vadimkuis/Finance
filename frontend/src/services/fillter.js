import {GetOperation} from "./getOperation.js";

export class Filters {
  constructor(period, from, to) {
    return this.getData(period, from, to)
      .then(data => this.processData(...data));
  }

  async getData(period, from, to) {
    const operations = await new GetOperation(period, from, to);

    // разделяются операции на доходы и расходы, получаем уникальные категории
    const [incomesOperations, expenseOperations] = this.getOperationsByCategory(operations);
    const incomesCategories = this.getUniqueCategories(incomesOperations);
    const expenseCategories = this.getUniqueCategories(expenseOperations);

    // вычисляется сумма для каждой категории доходов и расходов
    const incomesData = this.calculateTotalAmountsByCategory(incomesOperations, incomesCategories);
    const expensesData = this.calculateTotalAmountsByCategory(expenseOperations, expenseCategories);

    return [incomesCategories, incomesData, expenseCategories, expensesData];
  }

  getOperationsByCategory(operations) {
    // принимается массив операций и разделяет его на доходы и расходы
    const incomesOperations = operations.filter(operation => operation.type === 'income');
    const expenseOperations = operations.filter(operation => operation.type === 'expense');
    return [incomesOperations, expenseOperations];
  }

  getUniqueValues(arr) {
    // принимается массив и возвращает массив уникальных значений
    let result = [];
    for (let str of arr) {
      if (!result.includes(str)) {
        result.push(str);
      }
    }
    return result;
  }

  getUniqueCategories(operations) {
    // принимается массив операций и возвращает массив уникальных категорий
    return this.getUniqueValues(operations.map(({category}) => category));
  }

  calculateTotalAmountsByCategory(operationsArray, categories) {
    // принимается массив операций и массив категорий для вычисления суммы для каждой категории
    return categories.map(category => operationsArray
      .filter(operation => operation.category === category) // отфильтровка операций, относящихся только к текущей категории
      .reduce((acc, operation) => acc + operation.amount, 0) // складывается сумма операции
    );
  }

  processData(incomesCategories, incomesData, expenseCategories, expensesData) {
    // возвращаем данные после обработки
    return [incomesCategories, incomesData, expenseCategories, expensesData];
  }
}