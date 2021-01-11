<template>

  <transition name="panel-active">
    <div id="game" class="panel" v-if="showGame">

        <div class="game-header">
        <button type="button" class="btn game-header__stop-btn" id="game-stop" style="background: transparent;"
          v-bind:disabled="!showGame" v-on:click="stop">
          <img src="@/assets/back_arrow.png" alt="X">
        </button>
        <button type="button" class="btn game-header__stop-btn" id="game-stop" style="background: transparent;"
          v-bind:disabled="!showGame" v-on:click="stop">
          <img src="@/assets/recommend.png" alt="X">
        </button>
        <button type="button" class="btn game-header__stop-btn" id="game-stop" style="background: transparent;"
          v-bind:disabled="!showGame" v-on:click="showHelp">
          <img src="@/assets/help.png" alt="X">
        </button>
      </div>

      <div class="game-content">
        <img class="game-content__headerimage" style="border-radius: 5px;" :src="getMovieImage">
        <div class="game-content__metadata">
          <h1 class="game-content__title" style="color: white;">{{ getMovieName }}</h1>
          <h2 class="game-content__year">{{ getMovieYear }}</h2>
        </div>
      </div>

      <div class="game-buttons">

        <button type="button" class="btn game-button" id="game-fail"
          v-on:click="markFail" v-bind:disabled="!showGame">
          <img src="@/assets/dislike.png" alt="&cross;">
        </button>

        <button type="button" class="btn game-button" id="game-unknown"
          v-on:click="markUnknown" v-bind:disabled="!showGame">
          <img src="@/assets/shrug.png" alt="&cross;">
        </button>

        <button type="button" class="btn game-button" id="game-success"
          v-on:click="markSuccess" v-bind:disabled="!showGame">
          <img src="@/assets/like.png" alt="&check;">
        </button>
    </div>

    </div>
  </transition>

</template>

<script>

  export default {
    name: 'Game',
    computed: {
      showGame () {
        return this.$store.state.showGame;
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