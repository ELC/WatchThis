<template>

  <div id="app">
    <Menu/>
    <Rate/>
    <Highscores/>
  </div>

</template>

<script>
  import Menu from './components/Menu/Menu';
  import Rate from './components/Rate/Rate';
  import Highscores from './components/Highscores/Highscores';

  export default {
    name: 'app',
    components: {
      Menu,
      Rate,
      Highscores,
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
