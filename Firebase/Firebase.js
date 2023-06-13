// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
// const { getAuth } = require("firebase/auth");
// const {initializeApp,cert} = require("firebase-admin/app")
// const { getFirestore } = require("firebase-admin/firestore")
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth")
const data = require('../cace-camara-de-comercio-firebase-adminsdk-b2gna-b339a2287a.json')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBoDKWDFvbjwCJXs-X7iMaY5Zg-cI1nD_I",
    authDomain: "cace-camara-de-comercio.firebaseapp.com",
    databaseURL: "https://cace-camara-de-comercio-default-rtdb.firebaseio.com",
    projectId: "cace-camara-de-comercio",
    storageBucket: "cace-camara-de-comercio.appspot.com",
    messagingSenderId: "782097107729",
    appId: "1:782097107729:web:4480bbebe732bf2476dab0",
    measurementId: "G-1H2RFG9MSN"
  };
const app = initializeApp(firebaseConfig)
const db = getAuth(app);



/**
 *  Create The user with the email and the password provided.
 * 
 * @param {{email:String, password:String}} user - Object User
 * @returns {Promise<UserCredential>}
 */

const createUser = async (user) => {
    return await createUserWithEmailAndPassword(db,user.email,user.password);   
}
//   // Initialize Firebase
//   const app = initializeApp(firebaseConfig);
//   const auth = getAuth(app);
  module.exports = {
      db,
      createUser
}