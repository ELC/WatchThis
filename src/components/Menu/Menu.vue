<template>

  <div class="menu__wrapper">
    <div id="menu" v-bind:style="{overflow: showMainMenu || showHighscorePanel ? 'hidden': ''}">
      <div class="container">

        <div class="logo">
          <h1 class="logo__headline">Watch This!</h1>
        </div>
        
          <div class="user-form">
        <div class="form__group">
          <label for="user-name" class="user-form__label">Username <small>Reload to Change</small></label>
          <input type="text" class="form__input user-form__input" id="user-name" name="user-name"
            maxlength="30" :placeholder="userName" @keyup="processName">
        </div>

        <div class="menu-buttons">
          <button type="button" class="btn-menu" v-bind:disabled="startDisabled" v-on:click="startRate">
            Random Movie
          </button>
          <button type="button" class="btn-menu" v-on:click="showHistory">
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
      userName (){
        return this.$store.state.userName;
      },
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
