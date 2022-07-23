<template>
  <div class="container">
    <h1>Registro</h1>
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
    <p>
      <label for="exampleSelect1" class="form-label mt-4">Rol:</label>
      <select v-model="role" class="form-select" id="exampleSelect1">
        <option value="INTERN" selected>Interno</option>
        <option value="EXTERN">Externo</option>
      </select>
    </p>
    <p v-if="errorMsg">{{ errorMsg }}</p>
    <p><button class="btn btn-primary" @click="register">Enviar</button></p>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { useRouter } from "vue-router";
import { initializeApp } from "@firebase/app";
import { firebaseConfig } from "@/main";

export default class Register extends Vue {
  email = "";
  password = "";
  role = "INTERN";
  errorMsg = "";

  router = useRouter();
  db = getFirestore(initializeApp(firebaseConfig));
  auth = getAuth();

  register() {
    //console.log(this.email + "/" + this.password + "/" + this.role);
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(async (data) => {
        console.log("Usuario registrado!");
        const docRef = await addDoc(collection(this.db, "users"), {
          uid: data.user.uid,
          role: this.role,
        });
        console.log("Document written with ID: ", docRef.id);
        this.router.push("/feed");
      })
      .catch((error) => {
        console.log(error.code);
        alert(error.message);
      });
  }
}
</script>