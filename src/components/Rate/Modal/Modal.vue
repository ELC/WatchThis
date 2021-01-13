<template>
    <div class="modal" :class="active ? 'open' : 'closed'" @click="close()">
    
        <div class="card">
    
            <p class="modal-text">Keep Rating to Unlock Recommendations!</p>
    
            <small>Touch to continue rating</small>
    
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

    }
</script>