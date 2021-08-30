<template>
  <div id="login">
    <h3 class="text-center text-white pt-5">Login form</h3>
    <div class="container">
      <div id="login-row" class="row justify-content-center align-items-center">
        <div id="login-column" class="col-md-6">
          <div id="login-box" class="col-md-12">
            <form id="login-form" class="form" action="" method="post">
              <h3 class="text-center text-info">Login</h3>
              <div class="form-group">
                <label for="username" class="text-info">Username:</label><br>
                <input v-model="username" type="text" name="username" id="username" class="form-control">
              </div>
              <div class="form-group">
                <label for="password" class="text-info">Password:</label><br>
                <input v-model="password" type="text" name="password" id="password" class="form-control">
              </div>

              <br>
              <div class="form-group">
                <div class="row">
                  <div class="col-6">
                    <b-button type="button" @click="onLogin" variant="primary">Login</b-button>
                  </div>
                  <div class="col-6">
                    <b-button type="button" @click="onRegister" variant="primary">Register</b-button>
                  </div>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "LoginRegister",
  data() {
    return {
      username: "",
      password:""
    }
  },
  methods:{
    ...mapActions(["login", "register"]),
    onLogin(){
      const user = JSON.stringify({Username: this.username, Password: this.password});
      this.login(user);
    },
    onRegister(){
      const user = JSON.stringify({Username: this.username, Password: this.password});
      this.register(user);
      this.$router.push({path: '/'});
    }
  }
}
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  background-color: #17a2b8;
  height: 100vh;
}

#login .container #login-row #login-column #login-box {
  margin-top: 120px;
  max-width: 600px;
  height: 320px;
  border: 1px solid #9C9C9C;
  background-color: #EAEAEA;
}

#login .container #login-row #login-column #login-box #login-form {
  padding: 20px;
}

#login .container #login-row #login-column #login-box #login-form #register-link {
  margin-top: -85px;
}
</style>