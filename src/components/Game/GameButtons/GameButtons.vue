<template>
  <div class="game-buttons">

    <button type="button" class="btn btn--lg btn--fail game-button" id="game-fail"
      v-on:click="markFail" v-bind:disabled="!appStarted">
      <img src="@/assets/cross.svg" alt="&cross;">
    </button>

    <button type="button" class="btn btn--lg game-button" id="game-unknown"
      v-on:click="markUnknown" v-bind:disabled="!appStarted">
      <img src="@/assets/cross.svg" alt="&cross;">
    </button>

    <button type="button" class="btn btn--lg btn--success game-button" id="game-success"
      v-on:click="markSuccess" v-bind:disabled="!appStarted">
      <img src="@/assets/check.svg" alt="&check;">
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
