import React, { Component } from 'react';

import './App.css';
// import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import guide from './guide';
import Canvas from './draw';
class App extends Component {
  getColor({ startType, high }) {
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
          <Canvas />
          {
            guide.map(({ name, routes }) => {
              return (
                <div key={name}>
                  <h1>{name}</h1>
                  <table>
                    <thead>
                      <th className="cell">#</th>
                      <th className="cell">name</th>
                      <th className="cell">info</th>
                      <th className="cell">grade</th>
                    </thead>
                    <tbody>
                      {
                        routes.map(({ sign, name, grade, startType, high }) => (
                          <tr key={Math.random()}>
                            <td className="cell">{sign}</td>
                            <td className="cell">{name}</td>
                          <td className="cell">
                            <div className={this.getColor({ startType, high })}></div>
                        </td>
                            <td className="cell">{grade}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              )
            })
          }
      
    
  
      </div>
    </Router>
    );
  }
}
// {/* {
//   guide.map(({ name, routes }) => {
//     return (
//       <div key={name}>
//         <h1>{name}</h1>
//         <table>
//           <thead>
//             <th className="cell">#</th>
//             <th className="cell">name</th>
//             <th className="cell">info</th>
//             <th className="cell">grade</th>
//           </thead>
//           <tbody>
//             {
//               routes.map(({ sign, name, grade, startType, high }) => (
//                 <tr key={Math.random()}>
//                   <td className="cell">{sign}</td>
//                   <td className="cell">{name}</td>
//                 <td className="cell">
//                   <div className={this.getColor({ startType, high })}></div>
//               </td>
//                   <td className="cell">{grade}</td>
//                 </tr>
//               ))
//             }
//           </tbody>
//         </table>
//       </div>
//     )
//   }) */}
// }
// 
// {/* <Switch>
//     <Route exact path= "/" render={() => (
//       <Redirect to="/customerlist"/>
//     )}/>
//      <Route exact path='/customerlist' component={Customers} />
// </Switch> */}

export default App;
