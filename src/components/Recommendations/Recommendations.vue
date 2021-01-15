<template>

  <transition name="panel-active">
    <div id="recommendations" class="panel" v-if="showRecommendations">
      
      <div class="recommendations-header">
        <button type="button" class="recommendations-header-btn" v-bind:disabled="!showRecommendations" v-on:click="showRate">
          <img class="rate-header-images" src="@/assets/back_arrow.png">
        </button>
      </div>

      <div class="recommendations-content">

        <h2 class="recommendations-text">We recommend you</h2>

        <img class="recommendations-content__headerimage" :src="getMovie.movieImage">
        
        <div class="recommendations-content__metadata">
          <h1 class="recommendations-content__title">{{ getMovie.movieName }}</h1>
          <h2 class="recommendations-content__year">{{ getMovie.movieYear }}</h2>
        </div>
      </div>

      <div class="recommendations-buttons">
          <button type="button" class="recommendations-button" v-bind:disabled="!showRecommendations" v-on:click="rateThisMovie">
            Already watched? Rate it!
          </button>
          <button type="button" class="recommendations-button" v-bind:disabled="!showRecommendations" v-on:click="recommendNextMovie">
            Recommend another!
          </button>
      </div>

    </div>
  </transition>

</template>

<script>

  export default {
    name: 'Recommendations',
    computed: {
      showRecommendations () {
        return this.$store.state.showRecommendations
      },
      getMovie () {
        return this.$store.state.nextRecommendation;
      },
    },
    methods: {
      showRate () {
        this.$store.commit('showRate');
      },
      recommendNextMovie (){
        this.$store.commit('nextRecommendation')
      },
      rateThisMovie (){
        this.$store.commit('rateMovie', this.getMovie);
      }
    }
  };
</script>
