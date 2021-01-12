<template>

  <transition name="panel-active">
    <div id="rate" class="panel" v-if="showRate">

        <div class="rate-header">
        <button type="button" class="btn rate-header__stop-btn" id="rate-stop" style="background: transparent;"
          v-bind:disabled="!showRate" v-on:click="stop">
          <img src="@/assets/back_arrow.png" alt="X">
        </button>
        <button type="button" class="btn rate-header__stop-btn" id="rate-stop" style="background: transparent;"
          v-bind:disabled="!showRate" v-on:click="stop">
          <img src="@/assets/recommend.png" alt="X">
        </button>
        <button type="button" class="btn rate-header__stop-btn" id="rate-stop" style="background: transparent;"
          v-bind:disabled="!showRate" v-on:click="showHelp">
          <img src="@/assets/help.png" alt="X">
        </button>
      </div>

      <div class="rate-content">
        <img class="rate-content__headerimage" style="border-radius: 5px;" :src="getMovieImage">
        <div class="rate-content__metadata">
          <h1 class="rate-content__title" style="color: white;">{{ getMovieName }}</h1>
          <h2 class="rate-content__year">{{ getMovieYear }}</h2>
        </div>
      </div>

      <div class="rate-buttons">

        <button type="button" class="btn rate-button" id="rate-fail"
          v-on:click="markFail" v-bind:disabled="!showRate">
          <img src="@/assets/dislike.png" alt="&cross;">
        </button>

        <button type="button" class="btn rate-button" id="rate-unknown"
          v-on:click="markUnknown" v-bind:disabled="!showRate">
          <img src="@/assets/shrug.png" alt="&cross;">
        </button>

        <button type="button" class="btn rate-button" id="rate-success"
          v-on:click="markSuccess" v-bind:disabled="!showRate">
          <img src="@/assets/like.png" alt="&check;">
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
      },
      showHelp () {
        this.$store.commit('showHelp');
      }
    }
  };
</script>