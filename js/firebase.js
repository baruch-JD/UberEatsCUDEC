const firebaseConfig = {

    apiKey: "AIzaSyC6fcMXd29_t2HmdVMNdU5QrikaUQ0dYNA",

    authDomain: "ubereatsbaruch.firebaseapp.com",

    projectId: "ubereatsbaruch",

    storageBucket: "ubereatsbaruch.firebasestorage.app",

    messagingSenderId: "177016882704",

    appId: "1:177016882704:web:49295885b26d8decdc2c95",

    measurementId: "G-8G9VLR3TJS"

};


// Inicializar Firebase
firebase.initializeApp(firebaseConfig);


// Conexión con Firestore
const db = firebase.firestore();