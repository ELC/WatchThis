<template>

  <div id="app">
    <Menu/>
    <Game/>
    <Highscores/>
    <Help/>
  </div>

</template>

<script>
  import Menu from './components/Menu/Menu';
  import Game from './components/Game/Game';
  import Highscores from './components/Highscores/Highscores';
  import Help from './components/Help/Help';

  export default {
    name: 'app',
    components: {
      Menu,
      Game,
      Highscores,
      Help
    },
    mounted() {
      this.$store.commit('initHistory');
    }
  };
</script>

<style type="text/css" lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300|Open+Sans:400,700&display=swap');
  @import "@/styles/app.scss";
</style>
