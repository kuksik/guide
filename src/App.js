import React, { Component } from 'react';
import ReactModal from 'react-modal';

import './App.css';
// import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import guide from './guide';
import Canvas from './draw';

import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/database';



var firebaseConfig = {
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
console.log(firebase)
const sectors = firebase.database().ref();
// sectors.on('value', function(snap) {
//   console.log('daslkdadlajslkj')
//   console.log(snap.val())
// });


var storage = firebase.storage();
var storageRef = storage.ref();

// var firstPage =  storageRef.child('sculpture').list({ maxResults: 100})
// .then(r => {
//   console.log(r)
// }).catch(e => {
//   console.log(e)
// })
// // console.log(firstPage)


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sectors: [],
      loading: false,
      showModal: false,
      selectedRoute: null,
      selectedRroutes: null,
      selectedRoutePath: null
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    sectors.on('value', snapshot => {
      this.setState({ loading: false, sectors: snapshot.val() });
    });
  }
  handleOpenModal = (selectedRoute, routeIndex, sectorIndex) => { 
    const selectedRoutePath = `${sectorIndex}/routes/${routeIndex}`;
    const selectedImage = this.state.sectors[sectorIndex].routes[routeIndex].picture;
    const imageRoutes = this.state.sectors[sectorIndex].routes.filter(({ picture, line }, index) => {
      return (
        routeIndex !== index && picture === selectedImage && line
      )
    });
  
    const selectedRoutes = [
      ...imageRoutes
    ]
    this.setState({ showModal: true, selectedRoute, selectedRoutes, selectedRoutePath });
  }
  handleCloseModal = () => {
    this.setState({
      showModal: false,
      selectedRoutes: null,
      selectedPicture: null,
      selectedRoutePath: null,
    });
  }
  getColor = ({ startType, high }) => {
    const color = startType === 0
      ? 'white'
      : startType === 1 ? 'yellow' : 'black';
    const border = !!high ? 'high' : '';
    return `circle ${color} ${border}`
  };
  render() {
    return (

      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <header className="App-header">        
            <h1 className="App-title">Ostriv Paskhy</h1>
          </header>
          {
            this.state.sectors.map(({ name, routes }, sectorIndex) => {
              return (
                <div key={name}>
                  <h1>{name}</h1>
                  <table>
                    <thead>
                      <th className="cell">#</th>
                      <th className="cell">name</th>
                      <th className="cell">info</th>
                      <th className="cell">grade</th>
                      <th className="cell">image</th>
                    </thead>
                    <tbody>
                      {
                        routes.map((route, routeIndex) => (
                          <tr key={Math.random()}>
                            <td className="cell">{route.sign}</td>
                            <td className="cell">{route.name}</td>
                            <td className="cell">
                              <div className={this.getColor({ startType: route.startType, high: route.high })}></div>
                            </td>
                            <td className="cell">{route.grade}</td>
                            <td className="cell">
                              <button onClick={() => this.handleOpenModal(route, routeIndex, sectorIndex)}>
                                { route.line ? 'show' : 'draw'}
                              </button>
                              </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              )
            })
          }
      
          <ReactModal 
           isOpen={this.state.showModal}
           contentLabel="Minimal Modal Example"
          >
            <button onClick={this.handleCloseModal}>Close Modal</button>
              <Canvas
                      firebase={firebase}
                      route={this.state.selectedRoute}
                      routePath={this.state.selectedRoutePath}
                      selectedRroutes={this.state.selectedRoutes}
                    />
          </ReactModal>
  
      </div>
    </Router>
    );
  }
}

export default App;
