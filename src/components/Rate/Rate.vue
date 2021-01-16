<template>

  <transition name="panel-active">
    <div id="rate" class="panel" v-if="showRate">
      
      <!-- HEADER -->
      <span class="rate-header-level">Level {{ level }}</span>
      
      <div class="rate-header">

        <button type="button" class="rate-header-btn" v-bind:disabled="!showRate" v-on:click="showMenu">
          <img class="rate-header-images" src="@/assets/back_arrow.png">
        </button>
        
        <button type="button" class="rate-header-btn" id="recommend-btn" 
        :class="{'recommend-disabled' : !recommendationsEnabled}"  v-on:click="showRecommendations">
          <img class="rate-header-images" src="@/assets/recommend.png">
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
      }
    },
    methods: {
      resetSkip (){
        this.$store.commit('resetIgnore');
        this.$store.commit('setNewMovie');
      },
      showMenu () {
        this.$store.commit('showMenu');
      },
      markSuccess () {
        this.$store.commit('commitSuccess');
      },
      markUnknown () {
        this.$store.commit('commitUnknown');
      },
      markFail () {
        this.$store.commit('commitFail');
      },
      
      showRecommendations () {
        if (this.recommendationsEnabled){
          this.$store.commit('showRecommendations');
        } else {
          this.$emit('openModal');
        }
      }
    }
  };
</script>