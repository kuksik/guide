import React, { Component } from 'react';
import './App.css';
import Canvas from './draw';
import firebase from './firebase';

class Sector extends Component {
  constructor(props) {
    super(props);
    const { sectorInfo: { routes }, sectorIndex } = props;
    const selectedRouteIndex = 0;
    const selectedRoute =  routes[0];
    const imageUrl = routes[0].picture;
    const selectedRoutePath = this.getSelectedRoutePath({ sectorIndex, selectedRouteIndex: 0 });
    const imageRoutes = this.getImageRoutes({ routes, selectedRouteIndex, imageUrl });
    this.state = {
      imageUrl,
      imageRoutes,
      selectedRoute,
      selectedRoutePath,
      selectedRouteIndex,
      loadingImage: false,
    };
  }
  getImageRoutes = ({ routes, imageUrl, selectedRouteIndex }) => (
    routes.filter(({ picture, line }, index) => (
      selectedRouteIndex !== index && picture === imageUrl && line
    ))
  )
  getSelectedRoutePath = ({ sectorIndex, selectedRouteIndex }) => (
    `${sectorIndex}/routes/${selectedRouteIndex}`
  )
  componentDidMount() {
    this.setImageUrl({ selectedRoute: this.state.selectedRoute });
  }
  componentWillReceiveProps(nextProps) {
    const { sectorInfo: { routes } } = nextProps;
    const { selectedRoute: { picture:  imageUrl }, selectedRouteIndex } = this.state;
    const imageRoutes = this.getImageRoutes({ routes, imageUrl, selectedRouteIndex });
    const selectedRoute = routes.find((r, i) => ( i === selectedRouteIndex));
    this.setState({ imageRoutes, selectedRoute })
  }
  setImageUrl = async ({ selectedRoute }) => {
    try {
      this.setState({ loadingImage: true });
      const imageUrl = await firebase.storage().ref().child(selectedRoute.picture).getDownloadURL()
      this.setState({ imageUrl, loadingImage: false });
    } catch(e) { console.log(e); }    
  }
  updateSelectedRouteLine = async ({ line }) => {
    try {
      const { selectedRoute, selectedRoutePath } = this.state;
      await firebase.database().ref(selectedRoutePath).set({
        ...selectedRoute,
        line
      });
    } catch(e) { console.log(e); }
  }
  showRoute = (selectedRoute, routeIndex) => {
    const { sectorIndex } = this.props;
    const newState = { selectedRoute };
    newState.selectedRouteIndex = routeIndex;
    newState.selectedRoutePath = this.getSelectedRoutePath({ sectorIndex, selectedRouteIndex: routeIndex });
    if (this.state.selectedRoute.picture !== selectedRoute.picture) {
      this.setImageUrl({ selectedRoute })
        .then(() => {
          const imageRoutes = this.getImageRoutes({
            selectedRouteIndex: routeIndex,
            imageUrl: selectedRoute.picture,
            routes: this.props.sectorInfo.routes,
          });
          this.setState({ imageRoutes });
        });
    } else {
      newState.imageRoutes = this.getImageRoutes({
        selectedRouteIndex: routeIndex,
        imageUrl: selectedRoute.picture,
        routes: this.props.sectorInfo.routes,
      });
    }
    this.setState(newState);
  }
  renderLimits = ({ route }) => (
    `${route.notUseLeftRocks ? 'L' : ''} ${route.notUseRightRocks ? 'R' : ''}`
  )
  renderRouteInfoIcon = ({ route: { startType, high } }) => {
    const border = !!high ? 'high' : '';
    const color = startType === 0 ? 'white' : startType === 1 ? 'yellow' : 'black';
    return (<div className={`circle ${color} ${border}`}></div>);
  }
  renderButton = ({ route, routeIndex }) => {
    if (!route.picture) return '';
    return (
      <button onClick={() => this.showRoute(route, routeIndex )}>
          { route.line ? 'show' : 'draw'}
      </button>
    );
  }
  renderImage() {
    if (this.state.loadingImage) return <h2>Loading...</h2>;
    return (
      <Canvas
        imageUrl={this.state.imageUrl}
        imageRoutes={this.state.imageRoutes}
        selectedRoute={this.state.selectedRoute}
        updateSelectedRouteLine={this.updateSelectedRouteLine}
      />
    );
  }
  render() {
    const { sectorPath, sectorInfo: { routes, name: sectorName } } = this.props;
    return (
      <div key={sectorName} className="sector-container">
        <div className="routes-container">
          <h1>{sectorPath + 1} - {sectorName}, {routes.length}</h1>
          <table>
            <thead>
              <tr>
                <th className="cell">#</th>
                <th className="cell">name</th>
                <th className="cell">info</th>
                <th className="cell">grd</th>
                <th className="cell">lmt</th>
                <th className="cell">img</th>
              </tr>
            </thead>
            <tbody>
              {
                routes.map((route, routeIndex) => (
                  <tr key={routeIndex} className={`${this.state.selectedRouteIndex === routeIndex && 'selected_row'} row`}>
                    <td className="cell">{route.sign}</td>
                    <td className="cell">{route.name}</td>
                    <td className="cell">{this.renderRouteInfoIcon({ route })}</td>
                    <td className="cell">{route.grade}</td>
                    <td className="cell">{this.renderLimits({ route })}</td>
                    <td className="cell">{this.renderButton({ route, routeIndex })}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="image_container">{this.renderImage()}</div>
    </div>
    );
  }
}

export default Sector;
