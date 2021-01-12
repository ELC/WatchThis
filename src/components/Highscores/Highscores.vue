<template>

  <transition name="panel-active">
    <div id="highscores" class="panel panel--left" v-if="showHighscorePanel">
      
      <div class="highscore-header">
        <button type="button" class="highscore-header-btn" v-bind:disabled="!showHighscorePanel" v-on:click="showMenu">
            <img class="highscore-header-images" src="@/assets/back_arrow.png">
        </button>
       </div>
      
      <div class="table-wrapper highscores-table__wrapper">
        <table class="highscores-table" v-if="hasHighscores">
          <tbody>
          <Highscore v-for="(highscore, index) in highscores" :key="index" :highscore="highscore"
            :highscoreIndex="index"/>
          </tbody>
        </table>
        <h2 class="history-warning" v-if='!hasHighscores' v-on:click="startRate">Go Rate Your First Movie!</h2>
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
        return this.$store.state.ratings.length !== 0;
      },
      highscores: function () {
        return this.$store.state.ratings;
      }
    },
    methods: {
      showMenu () {
        this.$store.commit('showMenu');
      },
      startRate () {
        this.$store.commit('startRate');
      }
    }
  };
</script>
