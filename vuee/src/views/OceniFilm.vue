<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-group>
        <b-form-input v-model="ocena" placeholder="Unesite ocenu" required></b-form-input>

      </b-form-group>
      <b-form-group>
        <b-form-textarea
            v-model="komentar"
            placeholder="Unesite komentar"
            required
        ></b-form-textarea>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "OceniFilm",
  data(){
    return{
      ocena:"",
      komentar:""
    }
  },
  methods:{
    onSubmit(){
      const ocena = JSON.stringify({Ocena: parseInt(this.ocena), Komentar: this.komentar, idFilma: parseInt(this.$route.params.id)});
      this.oceni_film({id: this.$route.params.id, ocena: ocena});
      this.$router.push({path: `/film/${this.$route.params.id}`});
    },
    ...mapActions(['oceni_film'])
  },
}
</script>

<style scoped>

</style>