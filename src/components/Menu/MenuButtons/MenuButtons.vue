<template>
  <div class="menu-buttons">
    <button type="button" class="btn btn--lg" id="start-game" v-bind:disabled="startDisabled" v-on:click="startGame">
      Random Movie
    </button>
    <button type="button" class="btn btn--lg">
      Watch This!
    </button>
    <button type="button" class="btn btn--lg" id="show-highscores" v-on:click="showHistory">
      History
    </button>
  </div>
</template>

<script>
  export default {
    name: 'MenuButtons',
    computed: {
      startDisabled () {
        return !this.$store.state.appReady;
      }
    },
    methods: {
      startGame () {
        this.$store.commit('startGame');
      },
      showHistory () {
        this.$store.commit('showHistory');
      }
    }
  };
</script>
