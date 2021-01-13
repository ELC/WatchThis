import Vue from 'vue';
import Vuex from 'vuex';
import AppData from './AppData';
import RandomUserName from '../data/randomUsername';
import {db} from '../firebase';

Vue.use(Vuex);

// Create the game store
const store = new Vuex.Store({
  state: {
    movie: AppData.getRandomMovie([]),
    nextMovie: AppData.getRandomMovie([]),
    allMoviesCovered: false,

    // General game data
    userName: RandomUserName.getRandomUserName(),
    userReady: true,
    appReady: AppData.isReady(),
    ratings: [],
    visited: [],

    // App states
    showMainMenu: true,
    showRatingPanel: false,
    showRate: false,
    showRecommendations: false,
  },

  mutations: {

    // Global

    appReady(state){
      state.appReady = AppData.isReady() && state.userReady;
    },


    // Navigation
    hideEverything (state){
      state.showRate = false;
      state.showMainMenu = false;
      state.showRatingPanel = false;
      state.showRecommendations = false;
    },

    showOnlyView (state, viewName) {
      this.commit('hideEverything');
      this.commit('showView', viewName)
    },

    showView (state, viewName) {
      state[viewName] = true;
    },


    // Menu

    showMenu (state) {
      this.commit('showOnlyView', "showMainMenu");
    },


    updateUser(state, username){
      state.userReady = username.length !== 0
      
      if (state.userReady){
        state.userName = username;
      }
    },


    // Ratings
    showRatings (state) {
      this.commit('showOnlyView', "showRatingPanel");
    },


    // Recommendation
    showRecommendations (state) {
      this.commit('showView', "showRecommendations");
    },


    // Rate

    showRate (state) {
      this.commit('showOnlyView', "showRate");
    }, 

    startRate (state) {
      this.commit('showRate')
      this.commit('initRatings');
    },

    commitSuccess (state) {
      this.commit("saveRating", 1);
      this.commit('setNewMovie');
    },

    commitUnknown (state) {
      this.commit('setNewMovie');
    },

    commitFail (state) {
      this.commit("saveRating", -1);
      this.commit('setNewMovie');
    },


    setNewMovie (state) {
      state.movie = state.nextMovie;

      let skipIds = state.ratings
                    .filter(rating => rating.userId === state.userName)
                    .map(rating => rating.movieId);

      state.visited.push(state.movie.movieId);

      let skipWithoutDuplicates = new Set(skipIds.concat(state.visited));

      if (skipWithoutDuplicates.size < AppData.getLength()){
        state.nextMovie = AppData.getRandomMovie(Array.from(skipWithoutDuplicates.values()));
        return
      }

      state.movie = {
        "movieName": "You covered all our database :)",
        "movieYear": "",
        "movieId": "-1",
        "movieImage": "https://www.actbus.net/fleetwiki/images/8/84/Noimage.jpg"
      };
    },

    

    // Ratings
    
    initRatings(state) {
      if (state.ratings.length !== 0) {
        return
      }

      let storage = localStorage.getItem('movieRatings');

      if (typeof(storage) !== 'undefined' && storage !== null) {
        state.ratings = JSON.parse(storage);
      }

      state.ratings = state.ratings.filter(rating => rating.userId === state.userName);

      this.commit("sortRatings");
    },

    pushToDatabase(state, entry){
      db.push(entry);
    },

    saveRating (state, user_rating) {
      let rating = {
        userId: state.userName,
        movieId: state.movie.movieId,
        movieName: state.movie.movieName,
        rating: user_rating,
        timestamp: Date.now()
      };

      state.ratings.push(rating);
      console.log(state.userName, state.movie.movieId, user_rating);

      this.commit("pushToDatabase", rating);


      if (typeof(Storage) !== 'undefined') {
        localStorage.setItem('movieRatings', JSON.stringify(state.ratings));
      }

      this.commit("sortRatings");

    },

    sortRatings(state) {
      state.ratings = state.ratings.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
    }

  }
});

export default store;
