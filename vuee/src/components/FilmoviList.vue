<template>
  <div>
    <b-table
        hover v-if="filmovi.length"
        sticky-header="800px"
        :items="filmovi"
        :fields="fields"
        head-variant="light"
        @row-clicked="editFilm">
      <template v-slot:cell(delete)="row">
        <b-button variant="danger" @click="delete_film(row.item.id)">Delete</b-button>
      </template>
      <template v-slot:cell(oceni)="row">
        <b-button variant="success" @click="oceniFilm(row.item.id)">Oceni</b-button>
      </template>
      <template v-slot:cell(edit)="row">
        <b-button variant="warning" @click="izmeniFilm(row.item.id)">Izmeni</b-button>
      </template>
    </b-table>
    <h1 v-else>No messages</h1>
  </div>
</template>

<script>
  import router from "@/router";
  import {mapState, mapActions} from "vuex";

  export default {
    name: "FilmoviList.vue",
    computed:{
      ...mapState(['filmovi'])
    },
    data(){
      return {
        fields: [
          { key: 'Naziv' },
          { key: 'Godina' },
          { key: 'Zanr' },
          { key: 'delete' },
          { key: 'oceni'},
          { key: 'edit'}
        ]
      }
    },
    methods:{
      ...mapActions(['delete_film', 'load_filmovi']),

      editFilm: function (item, index, event){
        router.push({path: `/film/${item.id}`})
      },
      oceniFilm: function(id){
        router.push({path: `/oceni/${id}`})
      },
      izmeniFilm: function(id){
        router.push({path: `/edit/${id}`})
      }
    },
    mounted() {
      this.load_filmovi();
    }
  }
</script>

<style scoped>

</style>