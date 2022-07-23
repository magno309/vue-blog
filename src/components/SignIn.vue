<template>
  <div class="container">
    <h1>Inicicar sesión</h1>
    <div class="card border-secondary m-3 p-3">
      <p>
        <input
          class="form-control"
          type="text"
          placeholder="Correo"
          v-model="email"
        />
      </p>
      <p>
        <input
          class="form-control"
          type="password"
          placeholder="Contraseña"
          v-model="password"
        />
      </p>
      <p v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</p>
      <p><button class="btn btn-primary" @click="register">Enviar</button></p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

export default class SignIn extends Vue {
  email = "";
  password = "";
  errorMsg = "";

  router = useRouter();
  auth = getAuth();

  register() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then((data) => {
        console.log("Usuario Logeado!");
        this.router.push("/feed");
      })
      .catch((error) => {
        console.log(error.code);
        switch (error.code) {
          case "auth/invalid-email":
            this.errorMsg = "Correo invalido!";
            break;
          case "auth/user-not-found":
            this.errorMsg = "No existe una cuenta con ese correo!";
            break;
          case "auth/wrong-password":
            this.errorMsg = "Contraseña incorrecta!";
            break;
          default:
            this.errorMsg = "Correo o contraseña incorrectos!";
            break;
        }
      });
  }
}
</script>