<template>

  <transition name="panel-active">
  <div id="help" class="panel" v-if="showHelp">
    
    <div class="rate-header">
      <button type="button" class="btn rate-header__stop-btn" id="rate-stop" style="background: transparent;"
        v-bind:disabled="!showHelp" v-on:click="showRate">
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
      showRate () {
        this.$store.commit('showRate')
      }
    }
  };
</script>
