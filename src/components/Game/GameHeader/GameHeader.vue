<template>
  <div class="game-header">
    <button type="button" class="btn game-header__stop-btn" id="game-stop" style="background: transparent;"
      v-bind:disabled="!appStarted" v-on:click="stop">
      <img src="@/assets/back_arrow.png" alt="X">
    </button>
  </div>
</template>

<script>
  export default {
    name: 'GameHeader',
    mounted () {
      this.$store.commit('startGame');
    },
    computed: {
      appStarted () {
        return this.$store.state.appStarted;
      }
    },
    methods: {
      stop () {
        this.$store.commit('stop');
      }
    }
  };
</script>
