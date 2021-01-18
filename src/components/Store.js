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
    movie: WatchThisData.getRandomMovieByLevel(1, []),
    nextMovie: WatchThisData.getRandomMovieByLevel(1, []),
    allMoviesCovered: false,

    // General game data
    userName: RandomUserName.getRandomUserName(),
    userLevel: -1,
    userReady: true,
    appReady: WatchThisData.isReady(),
    ratings: [],
    visited: [],
    recommended: [],
    nextRecommendation: {"movieId": -1},
    isRecommended: false,

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

    getUserLevel(state) {
      let rated_movies = state.ratings.filter(rating => rating.userId === state.userName);
      let positive_rated = rated_movies.filter(rating => rating.rating === 1).length;
      let negative_rated = rated_movies.filter(rating => rating.rating === -1).length;
      let rated_total = rated_movies.length;

      if (positive_rated >= 75 && negative_rated >= 20 && rated_total >= 250){
        state.userLevel = 4; // Approximately 1500-2000 movies in catalog
        return;
      }

      if (positive_rated >= 50 && negative_rated >= 10 && rated_total >= 100){
        state.userLevel = 3; // Approximately 1000 movies in catalog
        return;
      }

      if (positive_rated >= 30 && negative_rated >= 5 && rated_total >= 50){
        state.userLevel = 2; // Approximately 500 movies in catalog
        return;
      }
      
      if (positive_rated >= 15){
        if (state.userLevel === 0){
          this.commit('resetRecommendations');
        }
        state.userLevel = 1; // Approximately 200 movies in catalog
        return;
      }

      state.userLevel =  0; // Approximately 100 movies in catalog
    },


    updateUser(state, username){
      if (typeof(username) === 'undefined'){
        return;
      }
      
      state.userReady = username.length !== 0;
      state.userName = username;
      
      if (state.userReady){
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
      state.recommended = [];
      
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

        if (!alreadyWatched){
          state.recommended.push(movie)
          new Image().src = movie.movieImage; // Preload Image
        }
        
      });

      if (state.recommended.length === 0){
        state.recommended.push({
          "movieName": "",
          "movieYear": "",
          "movieId": -1,
          "movieImage": ""
        });
      }

      this.commit('nextRecommendation');
    }, 

    nextRecommendation (state) {
      let nextRecommendation = state.recommended.shift();

      if (typeof(nextRecommendation) === 'undefined'){
        nextRecommendation = {
          "movieName": "",
          "movieYear": "",
          "movieId": -1,
          "movieImage": ""
        };
      }

      state.nextRecommendation = nextRecommendation
    }, 

    rateMovie (state, movie) {
      this.commit('showRate');
      this.commit('nextRecommendation');
      state.movie = movie;
    },

    resetRecommendations (state){
      let ratedTotal = state.ratings.filter(rating => rating.userId === state.userName).length

      if (ratedTotal === 0){
        return;
      }
      
      Recommendation.getRecommendationByUser(state.userName)
                    .then(response => response.json())
                    .then(data => this.commit('addRecommendation', data[state.userName]));
    },

    startRate (state) {
      this.commit('showRate');
      this.commit('resetRecommendations');
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

      if (skipWithoutDuplicates.size < WatchThisData.getLengthByLevel(state.userLevel)){
        state.nextMovie = WatchThisData.getRandomMovieByLevel(state.userLevel, Array.from(skipWithoutDuplicates.values()));
        return;
      }

      state.movie = {
        "movieName": "You have to watch some of the movies to Unlock More :)",
        "movieYear": "",
        "movieId": -1,
        "movieImage": ""
      };
    },

    setRecommended (state, isRecommended){
      state.isRecommended = isRecommended;
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

    resetIgnore (state) {
      state.visited = [];
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
