import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "bootswatch/dist/lumen/bootstrap.min.css"
import { initializeApp } from "firebase/app";

export const firebaseConfig = {
    apiKey: "AIzaSyD1DlTs9MWnO91hVMcuqB0px9PSfVkJwp4",
    authDomain: "vue-firebase-320a9.firebaseapp.com",
    projectId: "vue-firebase-320a9",
    storageBucket: "vue-firebase-320a9.appspot.com",
    messagingSenderId: "235913483388",
    appId: "1:235913483388:web:2a360d55b63236eca065f9"
};

initializeApp(firebaseConfig);

createApp(App)
    .use(router)
    .mount('#app');
