<template>
  <div class="container mt-3">
    <h1>Feed</h1>
    <div class="row">
      <div class="col">
        <h3>Entradas recientes:</h3>
        {{ noteList }}
      </div>
      <div class="col">
        <h3>Nueva nota:</h3>
        <form @submit.prevent>
          <div class="form-group">
            <p>Fecha: {{ date }}</p>
            <label for="exampleTextarea" class="form-label">Mensaje:</label>
            <textarea
              class="form-control"
              id="exampleTextarea"
              rows="3"
              v-model="noteBody"
            ></textarea>
          </div>
          <button class="btn btn-primary mt-3" @click="publishNote">
            Enviar
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { collection, addDoc, getDocs, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { format } from "date-fns";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/main";
import { Note } from "@/interfaces/Note";

export default class Feed extends Vue {
  auth = getAuth();
  date = format(new Date(), "dd/MM/yyyy");
  noteBody = "";

  noteList: Note[] = [];

  db = getFirestore(initializeApp(firebaseConfig));

  async publishNote() {
    try {
      const docRef = await addDoc(collection(this.db, "notes"), {
        user: this.auth.currentUser?.email,
        date: this.date,
        noteBody: this.noteBody,
      });
      console.log("Document written with ID: ", docRef.id);
      this.loadNotes();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async loadNotes() {
    let fetchNoteList: Note[] = [];
    const querySnapshot = await getDocs(collection(this.db, "notes"));
    querySnapshot.forEach((doc) => {
      fetchNoteList.push({
        id: doc.id,
        user: doc.get("user"),
        date: doc.get("date"),
        noteBody: doc.get("noteBody"),
      });
      this.noteList = fetchNoteList.slice();
    });
  }

  mounted() {
    this.loadNotes();
  }
}
</script>

<style scoped>
</style>