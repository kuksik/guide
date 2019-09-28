import guide from './guide';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/database';

const fbi = () => {
  firebase.database().ref().set(guide);
};

export default fbi;