<template>

  <transition name="panel-active">
    <div id="rate" class="panel" v-if="showRate">
      
      <!-- HEADER -->
      <div class="rate-header">

        <button type="button" class="header-btn" v-bind:disabled="!showRate" v-on:click="stop">
          <img class="rate-header-images" src="@/assets/back_arrow.png">
        </button>
        
        <button type="button" class="header-btn" id="recommend-btn" v-bind:disabled="!showRate" v-on:click="stop">
          <img class="rate-header-images" src="@/assets/recommend.png">
        </button>

      </div>

      <!-- CONTENT -->
      <div class="rate-content">

        <img class="rate-content__headerimage" :src="getMovieImage">
        
        <div class="rate-content__metadata">
          <h1 class="rate-content__title">{{ getMovieName }}</h1>
          <h2 class="rate-content__year">{{ getMovieYear }}</h2>
        </div>

      </div>

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
  export default {
    name: 'Rate',
    computed: {
      showRate () {
        return this.$store.state.showRate;
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
    },
    methods: {
      stop () {
        this.$store.commit('stop');
      },
      markSuccess () {
        this.$store.commit('commitSuccess');
      },
      markUnknown () {
        this.$store.commit('commitUnknown');
      },
      markFail () {
        this.$store.commit('commitFail');
      }
    }
  };
</script>