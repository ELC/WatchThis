<template>
  <div class="game-content">
    <img class="game-content__headerimage" style="border-radius: 5px;" :src="getMovieImage">
    <div class="game-content__metadata">
      <h1 class="game-content__title" style="color: white;">{{ getMovieName }}</h1>
      <h2 class="game-content__year">{{ getMovieYear }}</h2>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GameContent',
    computed: {
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
