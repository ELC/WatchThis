let data = require('../../public/top_movies.json')['data'];

export default class WatchThisData {

  static getNumber(){
    return data.length;
  };

  static getById(movieId) {
    return data.filter(movie => movie[2] === movieId)[0]
  }

  static getRandom(skipIds) {
    var movie;
    
    do {
      let index = Math.floor(Math.random() * data.length);     

      movie = {
        "movieName": data[index][1],
        "movieYear": data[index][0],
        "movieId": data[index][2],
        "movieImage": data[index][3]
      };

    } while (skipIds.includes(movie.movieId));

    new Image().src = movie.movieImage; // Preload Image

    return movie
  };

  static getRecommended(user) {
    console.error("NOT IMPLEMENTED");
  }
}