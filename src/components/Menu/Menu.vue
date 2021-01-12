<template>

  <div class="menu__wrapper">
    <div id="menu" v-bind:style="{overflow: showMainMenu || showHighscorePanel ? 'hidden': ''}">
      <div class="container">

        <div class="logo">
          <h1 class="logo__headline">Watch This!</h1>
        </div>
        
          <div class="user-form">
        <div class="form__group">
          <label for="user-name" class="user-form__label">Username</label>
          <input type="text" class="form__input user-form__input" id="user-name" name="user-name"
            maxlength="30" placeholder="John Doe" @keyup="processName">
        </div>
      </div>

          <div class="menu-buttons">
    <button type="button" class="btn btn--lg" id="start-rate" v-bind:disabled="startDisabled" v-on:click="startRate">
      Random Movie
    </button>
    <button type="button" class="btn btn--lg" id="show-highscores" v-on:click="showHistory">
      History
    </button>
  </div>
        
      </div>
    </div>
  </div>

</template>

<script>

  export default {
    name: 'Menu',
    computed: {
      showHighscorePanel () {
        return this.$store.state.showHighscorePanel;
      },
      showMainMenu () {
        return this.$store.state.showMainMenu;
      },
      startDisabled () {
        return !this.$store.state.appReady;
      }
    },
    methods: {
      processName (e) {
        if (e.target.value.length > 0) {
          this.$store.commit('userReady', e.target.value);
        } else {
          this.$store.commit('userNotReady');
        }
      },
      processTurnDuration (e) {
        if (e.target.value.length > 0) {
          this.$store.commit('turnDuration', e.target.value);
        } else {
          this.$store.commit('turnNotSet');
        }
      },
       startRate () {
        this.$store.commit('startRate');
      },
      showHistory () {
        this.$store.commit('showHistory');
      }
    }
  };
</script>
