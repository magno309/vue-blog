<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Blog</a>
      <ul class="navbar-nav ms-auto">
        <li class="nav-item nav-link active">
          Bienvenido {{ auth.currentUser?.email }} !
        </li>
        <li class="nav-item">
          <router-link class="nav-link active" to="/">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/Feed">Feed</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/register" v-if="!isLoggedIn"
            >Registrar</router-link
          >
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/sign-in" v-if="!isLoggedIn"
            >Iniciar sesión</router-link
          >
        </li>
        <li class="nav-item">
          <button
            class="btn btn-secondary"
            type="submit"
            @click="handleLogOut"
            v-if="isLoggedIn"
          >
            Cerrar sesión
          </button>
        </li>
      </ul>
    </div>
  </nav>
  <router-view />
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import router from "./router";

export default class App extends Vue {
  isLoggedIn = false;
  auth = getAuth();

  handleLogOut() {
    console.log("Cerrar sesión");
    signOut(this.auth).then(() => {
      router.push("/");
    });
  }

  mounted() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  }
}
</script>

<style>
</style>
