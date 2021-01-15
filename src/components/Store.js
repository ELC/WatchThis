import Vue from 'vue';
import Vuex from 'vuex';
import WatchThisData from '../data/movies';
import RandomUserName from '../data/randomUsername';
import Recommendation from '../data/recommend'
import {db} from '../firebase';

Vue.use(Vuex);

// Create the game store
const store = new Vuex.Store({
  state: {
    movie: WatchThisData.getRandomMovie([]),
    nextMovie: WatchThisData.getRandomMovie([]),
    allMoviesCovered: false,

    // General game data
    userName: RandomUserName.getRandomUserName(),
    userLevel: 0,
    userReady: true,
    appReady: WatchThisData.isReady(),
    ratings: [],
    visited: [],
    recommended: [],
    nextRecommendation: null,

    // App states
    showMainMenu: true,
    showRatingPanel: false,
    showRate: false,
    showRecommendations: false,
  },

  mutations: {

    // Global

    appReady(state){
      state.appReady = WatchThisData.isReady() && state.userReady;
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
      if (typeof(username) === 'undefined'){
        return;
      }
      
      state.userReady = username.length !== 0;
      
      if (state.userReady){
        state.userName = username;
        this.commit("loadRatings");
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

    addRecommendation (state, movieIds) {
      movieIds.forEach(movieId => {
        let data = WatchThisData.getById(movieId);
        let movie = {
          "movieName": data[1],
          "movieYear": data[0],
          "movieId": data[2],
          "movieImage": data[3]
        };

        let alreadyWatched = state.ratings.filter(rating => rating.userId === state.userName)
                                          .map(rating => rating.movieId)
                                          .includes(movie.movieId);
        console.log(alreadyWatched)
        if (!alreadyWatched){
          state.recommended.push(movie)
        }
        
      });
      this.commit('nextRecommendation');
    }, 

    nextRecommendation (state) {
      let nextRecommendation = state.recommended.shift();

      if (typeof(nextRecommendation) === 'undefined'){
        nextRecommendation = {
          "movieName": "You covered all our database :)",
          "movieYear": "",
          "movieId": "-1",
          "movieImage": "https://www.actbus.net/fleetwiki/images/8/84/Noimage.jpg"
        };
      }

      state.nextRecommendation = nextRecommendation
    }, 

    rateMovie (state, movie) {
      this.commit('showRate');
      this.commit('nextRecommendation');
      state.movie = movie;
    },

    startRate (state) {
      this.commit('showRate');
      Recommendation.getRecommendationByUser(state.userName)
                    .then(response => response.json())
                    .then(data => this.commit('addRecommendation', data[state.userName]))
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

      if (skipWithoutDuplicates.size < WatchThisData.getLength()){
        state.nextMovie = WatchThisData.getRandomMovie(Array.from(skipWithoutDuplicates.values()));
        return;
      }

      state.movie = {
        "movieName": "You covered all our database :)",
        "movieYear": "",
        "movieId": "-1",
        "movieImage": "https://www.actbus.net/fleetwiki/images/8/84/Noimage.jpg"
      };
    },

    

    // Ratings

    // Database Interaction
    pushToDatabase(state, entry){
      db.ref("ratings").push(entry);
    },

    loadRatings(state){
      db.ref("ratings/")
        .orderByChild("userId")
        .equalTo(state.userName)
        .on("value", snapshot => this.commit("updateRatings", snapshot.toJSON()));
    },

    updateRatings(state, globalRatings){

      if (globalRatings === null){
        return;
      }

      console.log(Object.entries(globalRatings).length)

      Object.entries(globalRatings)
              .map(entry => entry[1])
              .forEach(userRating => state.ratings.push(userRating));

      this.commit("sortCleanRatings");
      this.commit("storeLocalRatings");
    },

    
    // Initialize local database and sync with cloud
    initRatings(state) {
      if (state.ratings.length !== 0) {
        return;
      }

      this.commit("readLocalRatings");
      this.commit("loadRatings");
      this.commit("sortCleanRatings");
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

      this.commit("sortCleanRatings");
      this.commit("storeLocalRatings");
      this.commit("pushToDatabase", rating);

    },

    storeLocalRatings(state){
      if (typeof(Storage) !== 'undefined') {
        localStorage.setItem('movieRatings', JSON.stringify(state.ratings));
      }
    },

    readLocalRatings(state){
      let storage = localStorage.getItem('movieRatings');

      if (typeof(storage) !== 'undefined' && storage !== null) {
        state.ratings = JSON.parse(storage);
      }
    },

    sortCleanRatings(state) {
      state.ratings = state.ratings.filter((value, index, self) => {
                                      let timestamps = self.map(rating => rating.timestamp);
                                      return timestamps.indexOf(value.timestamp) === index;
                                    });
      state.ratings = state.ratings.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
    }
  }
});

export default store;
