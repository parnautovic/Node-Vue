<template>
    <div>
        <b-jumbotron header="Filmovi" :lead="'Broj filmova: ' + filmovi.length">
        </b-jumbotron>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "Header",
        computed: {
            ...mapState(['filmovi'])
        }
    }
</script>

<style scoped>

</style>