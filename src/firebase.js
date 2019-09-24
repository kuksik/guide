import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCX2fz_DLp7amDBaizrMthzjHe0NpRybjs",
  authDomain: "ostriv-77c4f.firebaseapp.com",
  databaseURL: "https://ostriv-77c4f.firebaseio.com",
  projectId: "ostriv-77c4f",
  storageBucket: "gs://ostriv-77c4f.appspot.com/",
  messagingSenderId: "201962601087",
  appId: "1:201962601087:web:0dec2b4236c73bdffbdd4a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;
// const sectors = firebase.database().ref();
// sectors.on('value', function(snap) {
//   console.log('daslkdadlajslkj')
//   console.log(snap.val())
// });


// var storage = firebase.storage();
// var storageRef = storage.ref();

// var firstPage =  storageRef.child('sculpture').list({ maxResults: 100})
// .then(r => {
//   console.log(r)
// }).catch(e => {
//   console.log(e)
// })
// // console.log(firstPage)
