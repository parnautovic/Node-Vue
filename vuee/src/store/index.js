import Vue from 'vue'
import Vuex from 'vuex'
import router from "@/router";

Vue.use(Vuex)
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
export default new Vuex.Store({
  state: {
    filmovi:[],
  },
  mutations: {
    set_filmovi: function (state, filmovi){
      state.filmovi = filmovi;
    },
    add_film: function (state, film) {
      state.filmovi.push(film);
    },
    add_user: function (state, user){
      state.korisnik = user;
    },
    remove_film: function (state, id){
      for (let f = 0; f < state.filmovi.length; f++) {
        if (state.filmovi[f].id === id) {
          state.filmovi.splice(f, 1);
          break;
        }
      }
    },
    update_film: function (state, payload){
      for (let f = 0; f < state.filmovi.length; f++) {
        if (state.filmovi[f].id === parseInt(payload.id)) {
          state.filmovi[f].Naziv = payload.flm.Naziv;
          state.filmovi[f].Godina = payload.flm.Godina;
          state.filmovi[f].Zanr = payload.flm.Zanr;
          break;
        }
      }
    }
  },
  actions: {
    load_filmovi: function ({ commit }) {
      const token = localStorage.getItem('access_token');
      fetch('http://localhost:80/api/filmovi', {method: 'get', headers:{'x-access-token':token}}).then((response) => {
        if (!response.ok){
          if(response.status == 403){
            router.push({path: '/loginRegister'}).catch(()=>{})
            return;
          }else{
            throw response;
          }

        }
        return response.json();
      }).then((jsonData) => {
        commit('set_filmovi', jsonData)
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },
    delete_film: function({ commit }, id) {
      const token = localStorage.getItem('access_token');
      fetch(`http://localhost:80/api/film/${id}`, {
        method: 'delete',
        headers:{
          'x-access-token':token
        }
      }).then((response) => {
        if (!response.ok) {
          if (response.status == 403) {
            router.push({path: '/loginRegister'}).catch(()=>{})
            return;
          }
          throw  response;
        }
      }).then((jsonData) => {
        commit('remove_film', id)
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert("usao u eror");
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },
    change_film: function({ commit }, payload) {
      const token = localStorage.getItem('access_token');
      fetch(`http://localhost:80/api/film/${payload.id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: payload.flm
      }).then((response) => {
        if (!response.ok) {
          if (response.status == 403) {
            router.push({path: '/loginRegister'}).catch(()=>{})
            return;
          }
        }

        return response.json();
      }).then((jsonData) => {
        commit('update_film', {id: payload.id, flm:jsonData});
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },
    new_film: function({ commit }, film) {
      const token = localStorage.getItem('access_token');
      fetch('http://localhost/api/filmovi', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: film
      }).then((response) => {
        if (!response.ok) {
          if (response.status == 403) {
            router.push({path: '/loginRegister'}).catch(()=>{})
            return;
          }
          throw  response;
        }

        return response.json();
      }).then((jsonData) => {
        commit('add_film', jsonData);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },
    oceni_film: function({ commit }, film) {
      fetch(`http://localhost/api/oceni/${film.id}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: film.ocena
      }).then((response) => {
        if (!response.ok)
          throw response;

        return;
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },
    login: function({ commit }, user) {
      fetch('http://localhost/api/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: user
      }).then((response) => {
        if (!response.ok)
          throw response;
        return response.json();
      }).then((jsonData)=>{
        localStorage.setItem('access_token', jsonData.token);
        router.push({path: '/'}).catch(()=>{});
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },
    register: function({ commit }, user) {
      fetch('http://localhost/api/register', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: user
      }).then((response) => {
        if (!response.ok)
          throw response;
        return response.json();
      }).then((jsonData) => {
        localStorage.setItem('access_token', jsonData.token);
        router.push({path: '/'});
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    }


  },
  modules: {
  }
})
