<template>

  <transition name="panel-active">
    <div id="highscores" class="panel panel--left" v-if="showHighscorePanel">

      <h1>Rating History</h1>

      <p v-if="!hasHighscores">No hay puntuaciones registradas.</p>

      <div class="table-wrapper highscores-table__wrapper">
        <table class="highscores-table" v-if="hasHighscores">
          <thead>
          <tr>
            <th></th>
            <th>User</th>
            <th>Movie</th>
            <th>Rating</th>
            <th>Date</th>
          </tr>
          </thead>
          <tbody>
          <Highscore v-for="(highscore, index) in highscores" :key="index" :highscore="highscore"
            :highscoreIndex="index"/>
          </tbody>
        </table>
      </div>

        <div class="highscores-buttons">

    <button type="button" class="btn" id="highscores-back-to-menu" v-on:click="showMenu">
      Back To Menu
    </button>

  </div>

    </div>
  </transition>

</template>

<script>
  import Highscore from './Highscore/Highscore';

  export default {
    name: 'Highscores',
    components: {
      Highscore
    },
    computed: {
      showHighscorePanel () {
        return this.$store.state.showHighscorePanel;
      },
      hasHighscores () {
        return true;
      },
      highscores: function () {
        return this.$store.state.ratings;
      }
    },
    methods: {
      showMenu () {
        this.$store.commit('showMenu');
      }
    }
  };
</script>
