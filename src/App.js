import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';

import './App.css';
import Sector from './sector';
import firebase from './firebase';

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
    firebase.database().ref().on('value', snapshot => {
      this.setState({ loading: false, sectors: snapshot.val() });
    });
  }
  showSector = () => {
    if (this.state.loading) {
      return <h1>Loading...</h1>
    } else {
      return (
        <div>
          {this.state.sectors.map((sector, sectorIndex) => (
            <Sector
              sectorInfo={sector}
              sectorPath={sectorIndex}
            />
          ))}
        </div>
      )
    }
  }
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <header className="App-header">        
            <h1 className="App-title">Ostriv Paskhy</h1>
          </header>
          {this.showSector()}
      </div>
    </Router>
    );
  }
}

export default App;
