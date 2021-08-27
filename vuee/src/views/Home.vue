<template>
  <div class="home">
    <Header/>
    <b-container>
      <b-row>
        <b-col cm="6" >
          <FilmoviList/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Header from "@/components/Header";
import FilmoviList from "@/components/FilmoviList";
export default {
  name: "Home",
  components:{
    Header,
    FilmoviList
  }
}
</script>

<style scoped>

</style>