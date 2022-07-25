<template>
  <div class="container mt-3">
    <h1>Feed</h1>
    <div class="row">
      <div class="col">
        <h3>Entradas recientes:</h3>
        <h3 v-if="noteList.length === 0">No hay notas!</h3>
        <div class="card mb-3" v-for="(note, index) in noteList" :key="note.id">
          <div class="card-header">
            <div class="row">
              <div class="col">
                {{ note.user }}
              </div>
              <div class="col text-end">
                {{ note.date }}
              </div>
            </div>
          </div>
          <div class="card-body">
            <p class="card-text">
              {{ note.noteBody }}
            </p>
          </div>
          <hr class="mt-0" />
          <div class="ms-3 me-3 mb-3">
            <div>
              <h6 v-if="!note.comments">No hay comentarios!</h6>
              <h6 v-else>Comenarios:</h6>
              <ul class="list-group">
                <li
                  class="list-group-item"
                  v-for="(comment, index) in note.comments"
                  :key="index"
                >
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <span class="badge bg-primary rounded-pill">{{
                      comment.date
                    }}</span>
                    <span class="ms-3 me-3">{{ comment.comment }}</span>
                    <span>{{ comment.author }}</span>
                  </div>
                  <div class="form-group mt-3">
                    <div class="input-group mb-3">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Responder..."
                      />
                      <button
                        class="btn btn-primary"
                        type="button"
                      >
                        <font-awesome-icon icon="fa-solid fa-paper-plane" />
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="mt-3 form-group d-flex">
              <input
                type="text"
                class="form-control"
                placeholder="Comentar..."
                v-model.lazy="commentList[index]"
              />
              <button
                type="button"
                class="btn btn-primary"
                @click="publishComment(note, commentList[index], index)"
              >
                <font-awesome-icon icon="fa-solid fa-paper-plane" />
              </button>
            </div>
          </div>
          <div class="mt-3 list-group"></div>
        </div>
      </div>
      <div class="col">
        <h3>Nueva nota:</h3>
        <form @submit.prevent>
          <div class="form-group">
            <p>Fecha: {{ todayDate }}</p>
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
import { Options, Vue } from "vue-class-component";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  getFirestore,
  arrayUnion,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { format } from "date-fns";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/main";
import { Note } from "@/interfaces/Note";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPaperPlane);

@Options({
  components: { FontAwesomeIcon },
})
export default class Feed extends Vue {
  auth = getAuth();
  todayDate = format(new Date(), "dd/MM/yyyy");
  noteBody = "";

  noteComment = "";

  noteList: Note[] = [];
  commentList: string[] = [];
  answerList: string[] = [];

  db = getFirestore(initializeApp(firebaseConfig));

  async publishNote() {
    try {
      const docRef = await addDoc(collection(this.db, "notes"), {
        user: this.auth.currentUser?.email,
        date: this.todayDate,
        noteBody: this.noteBody,
      });
      console.log("Document written with ID: ", docRef.id);
      this.noteBody = "";
      this.loadNotes();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async publishComment(note: Note, noteComment: string, index: number) {
    try {
      await updateDoc(doc(this.db, "notes", note.id), {
        comments: arrayUnion({
          author: this.auth.currentUser?.email,
          date: this.todayDate,
          comment: noteComment,
        }),
      });
      this.loadNotes();
      this.commentList[index] = "";
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
        comments: doc.get("comments"),
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