<template>

  <transition name="panel-active">
    <div id="rate" class="panel" v-if="showRate">
      
      <!-- HEADER -->
      <span class="rate-header-level">Level {{ level }}</span>
      
      <div class="rate-header">

        <button type="button" class="rate-header-btn" v-bind:disabled="!showRate" v-on:click="showMenu">
          <img class="rate-header-images" src="@/assets/back_arrow.png">
        </button>
        
        <button type="button" class="rate-header-btn" id="recommend-btn"  v-on:click="showRecommendations">
          <img class="rate-header-images rate-header-recommend rate-header-recommend__enable" src="@/assets/recommend_enable.svg" v-if="recommendationsEnabled">
          <img class="rate-header-images rate-header-recommend rate-header-recommend__disable" src="@/assets/recommend_disable.svg" v-if="!recommendationsEnabled">
        </button>

      </div>

      <!-- CONTENT -->
      <div class="rate-content">

        <img class="rate-content__headerimage" :src="getMovie.movieImage">
        
        <div class="rate-content__metadata">
          <h1 class="rate-content__title">{{ getMovie.movieName }}</h1>
          <h2 class="rate-content__year">{{ getMovie.movieYear }}</h2>
        </div>

      </div>
      
      <Modal message="Keep Rating to Level Up and Unlock Recommendations!"></Modal>
      <Modal message="Watch and Rate more Movies to Level Up" 
            :callback="resetSkip"
            :alwaysvisible="true"
            v-if="getMovie.movieId === -1"></Modal>

      <!-- BUTTONS -->
      <div class="rate-buttons">

        <button type="button" class="rate-button" v-on:click="markFail" v-bind:disabled="!showRate">
          <img class="rate-images" src="@/assets/dislike.png">
        </button>

        <button type="button" class="rate-button" v-on:click="markUnknown" v-bind:disabled="!showRate">
          <img class="rate-images" src="@/assets/pass.png">
        </button>

        <button type="button" class="rate-button" v-on:click="markSuccess" v-bind:disabled="!showRate">
          <img class="rate-images" src="@/assets/like.png">
        </button>

      </div>

    </div>
  </transition>

</template>

<script>
import Modal from '../Modal/Modal';

  export default {
    name: 'Rate',
    components:{
      Modal,
    },
    metaInfo() {
      return {
        title: "Rate"
      };
    },
    computed: {
      showRate () {
        return this.$store.state.showRate;
      },
      getMovie () {
        return this.$store.state.movie;
      },
      level () {
        this.$store.commit('getUserLevel');
        return this.$store.state.userLevel;
      },
      recommendationsEnabled (){
        return this.level >= 1;
      },
      recommended (){
        return this.$store.state.isRecommended;
      }
    },
    methods: {
      resetSkip (){
        this.$store.commit('resetIgnore');
        this.$store.commit('setNewMovie');
      },
      showMenu () {
        this.$analytics.logEvent("Go to Menu from Rate");
        this.$store.commit('showMenu');
      },
      markSuccess () {
        this.$analytics.logEvent("Like");
        if (this.recommended){
          this.$analytics.logEvent("Liked Recommendations");
          this.$store.commit('setRecommended', false);
        }
        this.$store.commit('commitSuccess');
      },
      markUnknown () {
        this.$analytics.logEvent("Not Watched");
        this.$store.commit('commitUnknown');
      },
      markFail () {
        this.$analytics.logEvent("Dislike");
        if (this.recommended){
          this.$analytics.logEvent("Disliked Recommendations");
          this.$store.commit('setRecommended', false);
        }
        this.$store.commit('commitFail');
      },
      
      showRecommendations () {
        this.$analytics.logEvent("I want Recommendations");
        if (this.recommendationsEnabled){
          this.$store.commit('showRecommendations');
        } else {
          this.$analytics.logEvent("Level 0 Can't Watch");
          this.$emit('openModal');
        }
      }
    }
  };
</script>