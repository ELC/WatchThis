<template>
    <div class="modal" :class="active ? 'open' : 'closed'" @click="close()">
    
        <div class="card">
    
            <p class="modal-text">{{ message }}</p>
    
        </div>
    
    </div>
</template>

<script>
    export default {
        name: 'Modal',

        props: {
            'message': "",
            "callback": { type: Function }
        },

        data: () => ({
            active: false,
        }),


        methods: {
            open() {
                this.active = true;
            },
            close() {
                this.active = false;
                this.callback();
            },
        },

        created() {
            this.$parent.$on('openModal', this.open);
        },

    }
</script>