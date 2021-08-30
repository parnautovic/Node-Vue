<template>
  <div>
    <b-form >
      <b-form-group>
        <b-form-input v-model="naziv" placeholder="Unesite naziv filma" required></b-form-input>

      </b-form-group>
      <b-form-group>
        <b-form-input
            v-model="godina"
            placeholder="Unesite godinu"
            required
        ></b-form-input>
      </b-form-group>

      <b-form-group>
        <b-form-input
            v-model="zanr"
            placeholder="Unesite zanr"
            required
        ></b-form-input>
      </b-form-group>



      <b-button type="button" @click="onSubmit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "EditFilm",
  data(){
    return{
      naziv:"",
      godina:"",
      zanr:""
    }
  },
  methods:{
    onSubmit(){
      const flm = JSON.stringify({Naziv: this.naziv, Godina: this.godina, Zanr: this.zanr});
      this.change_film({id:this.$route.params.id, flm:flm});
      this.$router.push({path: '/'});
    },
    ...mapActions(['new_film', 'change_film'])
  },
  computed: {
    ...mapState(['filmovi']),
  },
  mounted: function() {
    for(let i =0 ; i<this.filmovi.length; i++){
      if (this.filmovi[i].id === parseInt(this.$route.params.id)){
        this.naziv = this.filmovi[i].Naziv;
        this.zanr = this.filmovi[i].Zanr;
        this.godina = this.filmovi[i].Godina;
      }
    }
  }
}
</script>

<style scoped>

</style>