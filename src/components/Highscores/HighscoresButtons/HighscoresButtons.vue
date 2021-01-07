<template>
  <div class="highscores-buttons">

    <button type="button" class="btn" id="highscores-back-to-menu" v-on:click="showMenu">
      Back To Menu
    </button>

  </div>
</template>

<script>
  export default {
    name: 'HighscoresButtons',
    props: ['hasHighscores'],
    methods: {
      showMenu () {
        this.$store.commit('showMenu');
      }
    }
  };
</script>
