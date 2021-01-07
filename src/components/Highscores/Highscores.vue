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

      <HighscoresButtons :hasHighscores="hasHighscores"/>

    </div>
  </transition>

</template>

<script>
  import Highscore from './Highscore/Highscore';
  import HighscoresButtons from './HighscoresButtons/HighscoresButtons';

  export default {
    name: 'Highscores',
    components: {
      Highscore,
      HighscoresButtons
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
    }
  };
</script>
