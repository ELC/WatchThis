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
    showMainMenu: true,
    showHighscorePanel: false,
    showHelp: false,
    showRate: false,
  },

  mutations: {
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
      state.showRate = false;
      this.commit('showMenu');
    },

    showRate (state) {
      state.showMainMenu = false;
      state.showHighscorePanel = false;
      state.showHelp = false;
      state.showRate = true;
    },

    startRate (state) {
      this.commit('showRate')
      this.commit('initHistory');
      this.commit('setNewMovie');
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

      if (skipWithoutDuplicates.size >= AppData.getLength()){
        state.nextMovie = {
          "movieName": "You covered all our database :)",
          "movieYear": "",
          "movieId": "0",
          "movieImage": "https://www.actbus.net/fleetwiki/images/8/84/Noimage.jpg"
        };

        return
      }

      state.nextMovie = AppData.getRandomMovie(Array.from(skipWithoutDuplicates.values()));

    },


    // Global actions
    showMenu (state) {
      state.showRate = false;
      state.showMainMenu = true;
      state.showHighscorePanel = false;
      state.showHelp = false;

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
      state.showRate = false;
      state.showMainMenu = false;
      state.showHighscorePanel = true;
      state.showHelp = false;
      this.commit('resetAppState');
    },

    showHelp (state) {
      state.showRate = true;
      state.showMainMenu = false;
      state.showHighscorePanel = false;
      state.showHelp = true;
    }

  }
});

export default store;
