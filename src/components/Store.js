import Vue from 'vue';
import Vuex from 'vuex';
import AppData from './AppData';

Vue.use(Vuex);

// Create the game store
const store = new Vuex.Store({
  state: {
    movieImage: "https://i5.walmartimages.com/asr/9f50302f-a5d7-4ea1-bd68-a956191e9003_1.2336cbe0c9518fd2378eabe3f32bbb0f.jpeg",
    movieId: "",
    movieName: "",
    movieYear: "",

    // General game data
    userName: 'John Doe',
    userReady: false,
    appReady: AppData.isReady(),
    ratings: [],

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
      let movieData = AppData.getRandomMovie();
      state.movieName = movieData[1];
      state.movieYear = movieData[0];
      state.movieId = movieData[2];
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
