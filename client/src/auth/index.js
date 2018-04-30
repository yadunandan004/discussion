import firebase from 'firebase';

//contains initial configuration of firebase authentication module

 var config = {
    apiKey: "AIzaSyDjJaatRFz6yBIE0zEQ6a6wjfBfVMfnGQU",
    authDomain: "discussion-2e476.firebaseapp.com",
    databaseURL: "https://discussion-2e476.firebaseio.com",
    projectId: "discussion-2e476",
    storageBucket: "discussion-2e476.appspot.com",
    messagingSenderId: "191443748875"
  };
  firebase.initializeApp(config);

//handle twitter sign in
export const twitterProvider = new firebase.auth.TwitterAuthProvider();  
export const auth=firebase.auth();

//can be used anywhere in the app
export default firebase;