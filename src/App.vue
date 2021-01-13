<template>

  <div id="app">
    <Menu/>
    <Rate/>
    <Ratings/>
    <Recommendations/>
  </div>

</template>

<script>
  import Menu from './components/Menu/Menu';
  import Rate from './components/Rate/Rate';
  import Ratings from './components/Ratings/Ratings';
  import Recommendations from './components/Recommendations/Recommendations';

  export default {
    name: 'app',
    components: {
      Menu,
      Rate,
      Ratings,
      Recommendations,
    },
    mounted() {
      this.$store.commit('initRatings');
    }
  };
</script>

<style type="text/css" lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300|Open+Sans:400,700&display=swap');
  @import "@/styles/app.scss";
</style>
