<script>
  import TabooData from '../data/data';

  export default {
    name: 'AppData',

    getRandomMovie (skipIds) {
      return TabooData.getRandom(skipIds);
    },

    getRecommended(user) {
      return TabooData.getRecommended(user);
    },

    getLength(){
      return TabooData.getNumber();
    },

    isReady(){
      return TabooData.getNumber() !== 0;
    }
  };
</script>
