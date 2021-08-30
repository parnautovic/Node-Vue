import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Film from "@/views/Film";
import NewFilm from "@/views/NewFilm";
import OceniFilm from "@/views/OceniFilm";
import EditFilm from "@/views/EditFilm";
import LoginRegister from "@/views/LoginRegister";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/new',
    name: 'newFilm',
    component: NewFilm
  },
  {
    path:'/loginRegister',
    name: 'loginRegister',
    component: LoginRegister
  },
  {
    path:'/edit/:id',
    name:'editFilm',
    component: EditFilm
  },
  {
    path: '/film/:id',
    name: 'film',
    component: Film
  },
  {
    path: '/oceni/:id',
    name: 'oceni',
    component: OceniFilm
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
