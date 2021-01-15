<template>

  <div class="menu__wrapper">
    <div id="menu" v-bind:style="{overflow: showMainMenu || showHighscorePanel ? 'hidden': ''}">
      <div class="container">

        <div class="logo">
          <h1 class="logo__headline">Watch This!</h1>
        </div>
        
        <div class="user-form">
          <div class="form__group">
            <label class="user-form__label">Username</label>
            <!-- <input type="text" class="form__input user-form__input" id="user-name" name="user-name" maxlength="30" :placeholder="userName" @keyup="processName"> -->
            <Dropdown :options="localUsers" v-on:selected="validateSelection" :name="userName" :placeholder="userName" v-on:filter="processName">
          </Dropdown>
          </div>
        </div>

        <div class="menu-buttons">
          <button type="button" class="btn-menu" v-bind:disabled="startDisabled" v-on:click="startRate">
            Rate Movies
          </button>
          <button type="button" class="btn-menu" v-on:click="showRatings">
            History
          </button>
        </div>
        
      </div>
    </div>
  </div>

</template>

<script>

import Dropdown from 'vue-simple-search-dropdown';

  export default {
    name: 'Menu',
    components: {
      Dropdown,
    },
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
      },
      localUsers (){
        let options = [];
        let uniqueUsers = [...new Set(this.$store.state.ratings.map(rating => rating.userId))];

        uniqueUsers.map(userName => options.push({id: uniqueUsers.indexOf(userName), 
                                                     name: userName}));

        return options;
      }
    },
    methods: {
      processName (userName) {
        this.$store.commit('updateUser', userName);
      },
      startRate () {
        this.$store.commit('startRate');
      },
      showRatings () {
        this.$store.commit('showRatings');
      },
      validateSelection (selection){
        this.$store.commit('updateUser', selection.name);
      }
    }
  };
</script>
