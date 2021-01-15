<script>
  import WatchThisData from '../data/data';

  export default {
    name: 'AppData',
    getRandomMovie (skipIds) {
      return WatchThisData.getRandom(skipIds);
    },

    getRecommended(user) {
      return WatchThisData.getRecommended(user);
    },

    getLength(){
      return WatchThisData.getNumber();
    },

    getById(movieId){
      return WatchThisData.getById(movieId);
    },

    isReady(){
      return WatchThisData.getNumber() !== 0;
    },
  };
</script>
