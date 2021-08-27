<template>
  <div class="home">
    <Header/>
    <h2>Film: <b>{{nazivFilma}}</b></h2>
    <b-container>

      <b-card title='Ocena' v-for="kritika in kritike" :key="kritika.idOcene">
        <b-card-text>{{kritika.Ocena}}</b-card-text>
        <b-card-text>Komentar: {{kritika.Komentar}}</b-card-text>
      </b-card>


    </b-container>
  </div>
</template>

<script>
import Header from "@/components/Header";
import {mapState} from "vuex";

export default {
  name: "Film",
  components: {Header},
  data() {
    return {
      kritike: [],
      nazivFilma:""
    }
  },
  computed: {
    ...mapState(['filmovi']),
  },
  mounted: function (){
    fetch(`http://localhost:80/api/ocene/${this.$route.params.id}`,  { method: 'get' }).then((response) => {
      if (!response.ok)
        throw response;
      return response.json();
    }).then((jsonData) => {
      this.kritike = jsonData;
    }).catch((error) => {
      if (typeof error.text === 'function')
        error.text().then((errorMessage) => {
          alert(errorMessage);
        });
      else
        alert(error);
    });

    for(let i =0; i<this.filmovi.length; i++){
      if (this.filmovi[i].id === parseInt(this.$route.params.id)){
        this.nazivFilma = this.filmovi[i].Naziv;
      }
    }
  }

}
</script>

<style scoped>

</style>