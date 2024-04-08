import {CustomHttp} from "./custom-http.js";
import config from "../../config/config.js";

export class GetCategory {

  // тип категории
  constructor(typeCategory) {
    return this.categories(typeCategory);
  }

  // запрос на сервер для получения списка категорий с указание типа
  async categories(typeCategory) {
    return await CustomHttp.request(config.host + '/categories/' + typeCategory);
  }
}