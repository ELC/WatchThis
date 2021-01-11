<template>
  <div class="game-buttons">

    <button type="button" class="btn game-button" id="game-fail"
      v-on:click="markFail" v-bind:disabled="!appStarted">
      <img src="@/assets/dislike.png" alt="&cross;">
    </button>

    <button type="button" class="btn game-button" id="game-unknown"
      v-on:click="markUnknown" v-bind:disabled="!appStarted">
      <img src="@/assets/shrug.png" alt="&cross;">
    </button>

    <button type="button" class="btn game-button" id="game-success"
      v-on:click="markSuccess" v-bind:disabled="!appStarted">
      <img src="@/assets/like.png" alt="&check;">
    </button>

  </div>
</template>

<script>
  export default {
    name: 'GameButtons',
    computed: {
      appStarted () {
        return this.$store.state.appStarted;
      }
    },
    methods: {
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
