<template>

  <div class="modal" :class="classes">
      <div class="card">
        <p class="modal-text">To access recommendations, rate at least 10 movies!</p>
        <button class="close-modal-btn" @click="close()">Close</button>
      </div>
  </div>

</template>

<script>
  export default {
    name: 'Modal',

    data: () => ({
    active: false,
  }),

  methods: {
    open() {
      this.active = true;
    },
    close() {
      this.active = false;
    },
  },

  created() {
    this.$parent.$on('openModal', this.open);
  },

  computed: {
    classes() {
      return this.active ? 'open' : 'closed';
    },
  },
}
</script>