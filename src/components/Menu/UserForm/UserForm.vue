<template>
  <div class="user-form">
    <div class="form__group">
      <label for="user-name" class="user-form__label">Username</label>
      <input type="text" class="form__input user-form__input" id="user-name" name="user-name"
        maxlength="30" placeholder="John Doe" @keyup="processName">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'UserForm',
    methods: {
      processName (e) {
        if (e.target.value.length > 0) {
          this.$store.commit('userReady', e.target.value);
        } else {
          this.$store.commit('userNotReady');
        }
      },
      processTurnDuration (e) {
        if (e.target.value.length > 0) {
          this.$store.commit('turnDuration', e.target.value);
        } else {
          this.$store.commit('turnNotSet');
        }
      }
    }
  };
</script>
