let data = require('../../public/top_movies.json')['data'];
let level1Data = require('../../public/top_movies_level0.json')['data'];
let level2Data = require('../../public/top_movies_level1.json')['data'];
let level3Data = require('../../public/top_movies_level2.json')['data'];
let level4Data = require('../../public/top_movies_level3.json')['data'];
let level5Data = require('../../public/top_movies_level4.json')['data'];

export default class WatchThisData {

  static getLength(){
    return data.length;
  };

  static getLengthByLevel(level){
    let levelsData = [level1Data, level2Data, level3Data, level4Data, level5Data]
    return levelsData[level].length;
  };

  static getById(movieId) {
    return data.filter(movie => movie[2] === movieId)[0]
  };

  static getRandomMovieByLevel(level, skipIds){
    var movie;

    let levelsData = [level1Data, level2Data, level3Data, level4Data, level5Data]

    let levelData = levelsData[level];

    do {
      let index = Math.floor(Math.random() * levelData.length);     

      movie = {
        "movieName": levelData[index][1],
        "movieYear": levelData[index][0],
        "movieId": levelData[index][2],
        "movieImage": levelData[index][3]
      };

    } while (skipIds.includes(movie.movieId));

    new Image().src = movie.movieImage; // Preload Image

    return movie
  }

  static getRandomMovie(skipIds) {
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

  static isReady(){
    return this.getLength() !== 0;
  };
}