import React, { Component } from 'react';
import './App.css';
import Canvas from './draw';

class Sector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: null,
      imageLoading: false,
      fullscreen: false,
      imageRoutes: [],
      selectedRoute: null,
      selectedRoutePath: null,
      selectedRouteIndex: 0
    };
  }
  showRoute = (selectedRoute, routeIndex) => {
    const selectedRouteIndex = routeIndex;
    const selectedRoutePath = `${this.props.sectorPath}/routes/${routeIndex}`;
    const selectedImage = selectedRoute.picture;
    const imageRoutes = this.props.sectorInfo.routes.filter(({ picture, line }, index) => {
      return (
        routeIndex !== index && picture === selectedImage && line
      )
    });
    this.setState({ selectedRoute, imageRoutes, selectedRoutePath, selectedRouteIndex });
  }
  getColor = ({ startType, high }) => {
    const color = startType === 0
      ? 'white'
      : startType === 1 ? 'yellow' : 'black';
    const border = !!high ? 'high' : '';
    return `circle ${color} ${border}`
  };
  limitation = (route) => {
    return `${route.notUseLeftRocks ? 'L' : ''} ${route.notUseRightRocks ? 'R' : ''}`
  }
  render() {
    const {
      sectorPath,
      sectorInfo: {
        routes,
        name: sectorName
      }
    } = this.props;
    console.log(this.props.sectorInfo)
    return (
      <div key={sectorName} className="sector-container">
        <div className="routes-container">
          <h1>{sectorPath + 1} - {sectorName}, {routes.length}</h1>
          <table>
            <thead>
              <th className="cell">#</th>
              <th className="cell">name</th>
              <th className="cell">info</th>
              <th className="cell">grd</th>
              <th className="cell">lmt</th>
              <th className="cell">img</th>
            </thead>
            <tbody>
              {
                routes.map((route, routeIndex) => (
                  <tr key={routeIndex} className={`${this.state.selectedRouteIndex === routeIndex && 'selected_row'} row`}>
                    <td className="cell">{route.sign}</td>
                    <td className="cell">{route.name}</td>
                    <td className="cell">
                      <div className={this.getColor({ startType: route.startType, high: route.high })}></div>
                    </td>
                    <td className="cell">{route.grade}</td>
                    <td className="cell">
                      {this.limitation(route)}
                    </td>
                    <td className="cell">
                      {
                        route.picture
                        ? (<button
                          onClick={() => this.showRoute(route, routeIndex )}
                        >
                          { route.line ? 'show' : 'draw'}
                        </button>)
                        : ''
                      }
                      </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="image_container">
          <Canvas
            route={this.state.selectedRoute}
            routePath={this.state.selectedRoutePath}
            selectedRroutes={this.state.imageRoutes}
          />
        </div>
    </div>
    );
  }
}

export default Sector;
