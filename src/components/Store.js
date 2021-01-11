import Vue from 'vue';
import Vuex from 'vuex';
import AppData from './AppData';

Vue.use(Vuex);

// Create the game store
const store = new Vuex.Store({
  state: {
    nextMovie: AppData.getRandomMovie([]),
    allMoviesCovered: false,

    // General game data
    userName: 'John Doe',
    userReady: false,
    appReady: AppData.isReady(),
    ratings: [],
    visited: [],

    // App states
    showMainMenu: false,
    showHighscorePanel: false,
    appStarted: false,
  },

  mutations: {
    // Start or stop the game
    startGame (state) {
      state.showMainMenu = true;
      state.appStarted = true;
      this.commit('initHistory');
      this.commit('setNewMovie');
    },

    userReady(state, username){
      state.userName = username;
      state.userReady = true;
      this.commit('appReady');
    },

    userNotReady(state){
      state.userReady = false;
      this.commit('appReady');
    },

    appReady(state){
      state.appReady = AppData.isReady() && state.userReady;
    },

    stop (state) {
      state.appStarted = false;
      this.commit('showMenu');
    },


    // In-game mutations
    commitSuccess (state) {
      state.rating = 1;
      this.commit("saveRating");
      this.commit('setNewMovie');
    },
    commitUnknown (state) {
      this.commit('setNewMovie');
    },
    commitFail (state) {
      state.rating = -1;
      this.commit("saveRating");
      this.commit('setNewMovie');
    },

    setNewMovie (state) {

      state.movieName = state.nextMovie.movieName;
      state.movieYear = state.nextMovie.movieYear;
      state.movieId = state.nextMovie.movieId;
      state.movieImage = state.nextMovie.movieImage;

      let skipIds = state.ratings
                    .filter(rating => rating.userId === state.userName)
                    .map(rating => rating.movieId);

      state.visited.push(state.movieId);

      let skipWithoutDuplicates = new Set(skipIds.concat(state.visited));

      if (skipWithoutDuplicates.length >= AppData.getLength() + 1){
        return
      }

      state.nextMovie = AppData.getRandomMovie(Array.from(skipWithoutDuplicates.values()));

      if (state.nextMovie === null){
        let movie = {
          "movieName": "You covered all our database :)",
          "movieYear": "",
          "movieId": "0",
          "movieImage": "https://www.actbus.net/fleetwiki/images/8/84/Noimage.jpg"
        };

        state.nextMovie = movie;
        state.allMoviesCovered = true;
      }
    },


    // Global actions
    showMenu (state) {
      state.appStarted = false;
      state.showMainMenu = false;
      state.showHighscorePanel = false;

      this.commit('resetAppState');
    },

    // End-game mutations
    resetAppState (state) {
      state.movieName = "";
      state.movieYear = "";
    },



    // Highscore actions
    initHistory(state) {
      if (state.ratings.length !== 0) {
        return
      }

      // Try to get the highscores from local storage
      let storage = localStorage.getItem('movieRatings');

      if (typeof(storage) !== 'undefined' && storage !== null) {
        state.ratings = JSON.parse(storage);
      }

      this.commit("sortHistory");
    },

    saveRating (state) {
      let rating = {
        userId: state.userName,
        movieId: state.movieId,
        movieName: state.movieName,
        rating: state.rating,
        timestamp: Date.now()
      };

      state.ratings.push(rating);
      console.log(state.userName, state.movieId, state.rating)

      if (typeof(Storage) !== 'undefined') {
        localStorage.setItem('movieRatings', JSON.stringify(state.ratings));
      }

      this.commit("sortHistory");

    },

    sortHistory(state) {
      state.ratings = state.ratings.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
    },

    showHistory (state) {
      state.appStarted = false;
      state.showMainMenu = false;
      state.showHighscorePanel = true;
      this.commit('resetAppState');
    },

  }
});

export default store;
