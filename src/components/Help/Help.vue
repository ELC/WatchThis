<template>

  <transition name="panel-active">
  <div id="help" class="panel" v-if="showHelp">
    
    <div class="game-header">
      <button type="button" class="btn game-header__stop-btn" id="game-stop" style="background: transparent;"
        v-bind:disabled="!showHelp" v-on:click="showGame">
        <img src="@/assets/back_arrow.png" alt="X">
      </button>
    </div>

  </div>
  </transition>

</template>

<script>

  export default {
    name: 'Help',
    computed: {
      showHelp () {
        return this.$store.state.showHelp
      },
    },
    methods: {
      showGame () {
        this.$store.commit('showGame')
      }
    }
  };
</script>
