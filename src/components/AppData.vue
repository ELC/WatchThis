<script>
  import TabooData from '../data/data';

  export default {
    name: 'AppData',
    colors: [
      {id: 'blue', value: '#1e88e5'},
      {id: 'orange', value: '#fb8c00'},
      {id: 'green', value: '#43a047'},
      {id: 'teal', value: '#00acc1'},
      {id: 'cyan', value: '#039be5'}
    ],
    getRandomMovie () {
      return TabooData.getRandom();
    },
    getRecommended(user) {
      return TabooData.getRecommended(user);
    },
    getColors () {
      return this.colors;
    },
    isReady(){
      return TabooData.getNumber() !== 0;
    }
  };
</script>
