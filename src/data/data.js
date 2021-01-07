let data = require('./top_movies.json')['data'];

export default class WatchThisData {

  static getNumber(){
    return data.length;
  };

  static getRandom() {
    return data[Math.floor(Math.random() * data.length)]
  };

  static getRecommended(user) {
    console.error("NOT IMPLEMENTED");
  }
}