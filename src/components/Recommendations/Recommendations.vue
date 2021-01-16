<template>

  <transition name="panel-active">
    <div id="recommendations" class="panel" v-if="showRecommendations">
      
      <div class="recommendations-header">
        <button type="button" class="recommendations-header-btn" v-bind:disabled="!showRecommendations" v-on:click="showRate">
          <img class="rate-header-images" src="@/assets/back_arrow.png">
        </button>
      </div>


      <Modal message="Keep Rating to Unlock More Recommendations Tomorrow" :callback="resetAndRate"></Modal>
      <Modal message="Personalized Recommendations will be Ready for You in an Hour :)" 
            :callback="resetAndRate" 
            :alwaysvisible="true"
            v-if="getMovie.movieId === -2">
      </Modal>

      <div class="recommendations-content" v-if="getMovie.movieId !== -1 && getMovie.movieId !== -2">

        <h2 class="recommendations-text">We recommend you</h2>

        <img class="recommendations-content__headerimage" :src="getMovie.movieImage">
        
        <div class="recommendations-content__metadata">
          <h1 class="recommendations-content__title">{{ getMovie.movieName }}</h1>
          <h2 class="recommendations-content__year">{{ getMovie.movieYear }}</h2>
        </div>
      </div>

      <div class="recommendations-buttons" v-if="getMovie.movieId !== -1 && getMovie.movieId !== -2">
          <button type="button" class="recommendations-button" v-bind:disabled="!showRecommendations" v-on:click="rateThisMovie">
            Already watched? Rate it!
          </button>
          <button type="button" class="recommendations-button" v-bind:disabled="!showRecommendations" v-on:click="recommendNextMovie">
            Recommend another!
          </button>
      </div>

    </div>
  </transition>

</template>

<script>
import Modal from '../Modal/Modal';

  export default {
    name: 'Recommendations',
    components:{
      Modal,
    },
    metaInfo() {
      return {
        title: "Recommendations"
      };
    },
    computed: {
      showRecommendations () {
        return this.$store.state.showRecommendations
      },
      getMovie () {
        return this.$store.state.nextRecommendation;
      },
    },

    methods: {
      resetAndRate (){
        this.$store.commit('resetRecommendations');
        this.$store.commit('showRate');
      },
      showRate () {
        this.$analytics.logEvent("Go to Rate From Recommendation");
        this.$store.commit('showRate');
      },
      recommendNextMovie (){
        this.$analytics.logEvent("Skip Recommendation");
        this.$store.commit('nextRecommendation')
        if (this.$store.state.nextRecommendation.movieId === -1){
          this.$emit('openModal');
        }
      },
      rateThisMovie (){
        this.$analytics.logEvent("Already Watched Recommendations");
        this.$store.commit('rateMovie', this.getMovie);
      }
    }
  };
</script>
