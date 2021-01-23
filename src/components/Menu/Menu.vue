<template>

  <div class="menu__wrapper">
    <div id="menu" v-bind:style="{overflow: showMainMenu || showHighscorePanel ? 'hidden': ''}">
      <div class="container">

        <div class="logo">
          <img class="logo__headerimage" src="@/assets/logo.svg">
          <h1 class="logo__headline">Watch This!</h1>
        </div>
        
        <div class="user-form">
          <div class="form__group">
            <label class="user-form__label">Keep this alias:</label>
            <Dropdown :options="localUsers" 
                      :name="userName" 
                      :placeholder="userName" 
                      v-on:selected="validateSelection" 
                      v-on:filter="processName"
                      >
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
    metaInfo() {
      return {
        title: "Menu"
      };
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
        if (typeof(userName) === 'undefined' || this.userName === userName || userName === ""){
          return;
        }
        this.$store.commit('updateUser', userName);
      },
      startRate () {
        this.$analytics.logEvent("Go to Rate from Menu");
        this.$store.commit('startRate');
      },
      showRatings () {
        this.$analytics.logEvent("Go to Ratings from Menu");
        this.$store.commit('showRatings');
      },
      validateSelection (userName){
        if (typeof(userName.name) === 'undefined' || this.userName === userName.name || userName.name === ""){
          return;
        }
        this.$store.commit('updateUser', userName.name);
      }
    }
  };
</script>
