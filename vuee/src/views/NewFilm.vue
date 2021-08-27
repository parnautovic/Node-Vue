<template>
  <div>
    <b-form @submit="onSubmit">
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



      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "NewFilm",
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
      this.new_film(flm);
      this.$router.push({path: '/'});
      },
    ...mapActions(['new_film'])
  },
  computed:{
    ...mapState(['filmovi'])
  }
}
</script>

<style scoped>

</style>