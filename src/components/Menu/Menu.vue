<template>

  <div class="menu__wrapper">
    <div id="menu" v-bind:style="{overflow: showMainMenu || showHighscorePanel ? 'hidden': ''}">
      <div class="container">

        <Logo/>
        <Disclaimer/>
        <UserForm/>
        <MenuButtons/>
        <MenuFooter/>

      </div>
    </div>
  </div>

</template>

<script>
  import Logo from './Logo/Logo';
  import Disclaimer from './Disclaimer/Disclaimer';
  import UserForm from './UserForm/UserForm';
  import MenuButtons from './MenuButtons/MenuButtons';
  import MenuFooter from './MenuFooter/MenuFooter';

  export default {
    name: 'Menu',
    components: {
      Logo,
      Disclaimer,
      UserForm,
      MenuButtons,
      MenuFooter
    },
    computed: {
      showHighscorePanel () {
        return this.$store.state.showHighscorePanel;
      },
      showMainMenu () {
        return this.$store.state.showMainMenu;
      }
    }
  };
</script>
