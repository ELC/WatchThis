<template>

  <transition name="panel-active">
    <div id="ratings" class="panel panel--left" v-if="showRatingPanel">
      
      <div class="rating-header">
        <button type="button" class="rating-header-btn" v-bind:disabled="!showRatingPanel" v-on:click="showMenu">
            <img class="rating-header-images" src="@/assets/back_arrow.png">
        </button>
       </div>
      
      <div class="table-wrapper ratings-table__wrapper">
        <table class="ratings-table" v-if="hasRatings">
          <tbody>
          <Rating v-for="(rating, index) in ratings" :key="index" :rating="rating" />
          </tbody>
        </table>
        <h2 class="rating-warning" v-if='!hasRatings' v-on:click="startRate">Go Rate Your First Movie!</h2>
      </div>

    </div>
  </transition>

</template>

<script>
  import Rating from './Rating/Rating';

  export default {
    name: 'Ratings',
    components: {
      Rating
    },
    metaInfo() {
      return {
        title: "Ratings"
      };
    },
    computed: {
      showRatingPanel () {
        return this.$store.state.showRatingPanel;
      },
      hasRatings () {
        return this.$store.state.ratings.length !== 0;
      },
      ratings: function () {
        return this.$store.state.ratings;
      }
    },
    methods: {
      showMenu () {
        this.$analytics.logEvent("Go To Menu from Ratings");
        this.$store.commit('showMenu');
      },
      startRate () {
        this.$analytics.logEvent("Go to Rate from Ratings");
        this.$store.commit('startRate');
      }
    }
  };
</script>
