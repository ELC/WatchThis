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

        <img class="recommendations-content__headerimage" src="https://images-na.ssl-images-amazon.com/images/I/51MJQKcJVFL._AC_.jpg">
        
        <div class="recommendations-content__metadata">
          <h1 class="recommendations-content__title">Ratatouille</h1>
          <h2 class="recommendations-content__year">2007</h2>
        </div>

        <a class="recommendation-watch" target="blank" href="https://movies.disney.com/ratatouille">Watch here!</a>

        <p class="recommendation-rate" v-on:click="showRate">Already watch it? Rate it here!</p>

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
    },
    methods: {
      showRate () {
        this.$store.commit('showRate')
      },
      getMovieImage () {
        return this.$store.state.nextMovie.movieImage;
      },
      getMovieName () {
        return this.$store.state.nextMovie.movieName;
      },
      getMovieYear () {
        return this.$store.state.nextMovie.movieYear;
      }
    }
  };
</script>
