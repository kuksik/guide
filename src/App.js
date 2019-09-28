import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
// import guide from './guide';
import './App.css';
import Sector from './sector';
import firebase from './firebase';
// import fbi from './firebaseImport'
// fbi()
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sectors: [],
      loading: false,
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    // this.setState({ loading: false, sectors: guide });
    firebase.database().ref().on('value', snapshot => {
      this.setState({ loading: false, sectors: [snapshot.val()[0]] });
    });
  }
  showSectors = () => {
    if (this.state.loading) {
      return <h1>Loading...</h1>
    } else {
      return (
        <div>
          {this.state.sectors.map((sector, sectorIndex) => (
            <Sector
              key={sectorIndex}
              sectorInfo={sector}
              sectorIndex={sectorIndex}
            />
          ))}
        </div>
      )
    }
  }
  render() {
    const routesAmount = this.state.sectors.reduce((a,s) => (a + s.routes.length), 0);
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <header className="App-header">        
            <h1 className="App-title">Ostriv Paskhy, {routesAmount}</h1>
          </header>
          {this.showSectors()}
      </div>
    </Router>
    );
  }
}

export default App;
