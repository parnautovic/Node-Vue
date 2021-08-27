import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

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
          state.filmovi[f].naziv = payload.flm.naziv;
          state.filmovi[f].godina = payload.flm.godina;
          state.filmovi[f].zanr = payload.flm.zanr;
          break;
        }
      }
    }
  },
  actions: {
    load_filmovi: function ({ commit }) {
      fetch('http://localhost:80/api/filmovi', {method: 'get', }).then((response) => {
        if (!response.ok)
          throw response;

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
      fetch(`http://localhost:80/api/film/${id}`, { method: 'delete' }).then((response) => {
        if (!response.ok)
          throw response;

        return;
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
      fetch(`http://localhost:80/api/film/${payload.id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: payload.flm
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('update_message', {id: payload.id, flm:jsonData});
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
      fetch('http://localhost/api/filmovi', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: film
      }).then((response) => {
        if (!response.ok)
          throw response;

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
    }


  },
  modules: {
  }
})
