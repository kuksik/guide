import React, { Component } from 'react';
import Immutable from 'immutable';
import firebase from './firebase';

class Canvas extends Component{
  constructor(props) {
    super(props)
    this.state = {
      pictureUrl: null,
      isDrawing: false,
      imageRoutes: props.selectedRroutes
        ? props.selectedRroutes.map(({ line }) => Immutable.fromJS(line))
        : [],
      selectedRoute: props.route && props.route.line
        ? [Immutable.fromJS(props.route.line)]
        : [],
      lines: new Immutable.List()
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.route) return null;
    firebase.storage().ref().child(nextProps.route.picture).getDownloadURL().then((pictureUrl) => {
      const imageRoutes = nextProps.selectedRroutes
        ? nextProps.selectedRroutes.map(({ line }) => Immutable.fromJS(line))
        : [];
      const selectedRoute =  nextProps.route && nextProps.route.line
        ? [Immutable.fromJS(nextProps.route.line)]
        : [];
      this.setState({ pictureUrl, selectedRoute, imageRoutes })
    }).catch((error) => { console.log(error) });


  }
  relativeCoordinatesForEvent(event) {
    const boundingRect = this.refs.drawArea.getBoundingClientRect();
    return new Immutable.Map({
      x: event.clientX - boundingRect.left,
      y: event.clientY - boundingRect.top,
    });
  }
  handleMouseDown = (event) => {
    if (!this.state.isDrawing) return false;
    if (event.button !== 0) return false;
    const point = this.relativeCoordinatesForEvent(event);

    this.setState(prevState => ({
      lines: prevState.lines.push(new Immutable.List([point])),
    }));
  }
  buttonClick = (e) => {
    const isDrawing = this.state.isDrawing;
    if (isDrawing) {
      this.props.firebase.database().ref(this.props.routePath).set({
        ...this.props.route,
        line: this.state.lines.toJS()
      });
      this.setState(prevState => ({
        isDrawing: !isDrawing,
        lines: new Immutable.List(),
        selectedRoute: [ ...prevState.selectedRoute, prevState.lines ]
      }));
    } else {
      this.setState({ isDrawing: !isDrawing });
    }
  }
  render(){
    if (!this.props.route) {
      return (<h2>select route...</h2>)
    }
    const style = { backgroundImage: `url('${this.state.pictureUrl}')` };
    return(
      <div>
        <button
          onClick={this.buttonClick} 
        >
          {this.state.isDrawing ? 'stop' : 'start' }
        </button>
        <div      
          id="drawArea"
          ref="drawArea"
          style={style}
          className="image"
          onMouseDown={this.handleMouseDown}
        >
          <Drawing
            lines={this.state.lines}
            imageRoutes={this.state.imageRoutes}
            finishedLines={this.state.selectedRoute}
          />
        </div>
      </div>
    )
  }
}

const Drawing = (props) => {
  const a = props.lines.map((line, index) => {
      return line.map(p => (`${p.get('x')},${p.get('y')}`))
  }).toJS().join(" ");
  return(
    <svg className="drawing">
      <polyline points={a}  strokeWidth="2" fill="none" stroke="yellow"/>
      {
        props.finishedLines.map((line) => {
          const b = line.map((l, index) => {
              return l.map(p => (`${p.get('x')},${p.get('y')}`))
          }).toJS().join(" ");
          return (
            <polyline points={b} strokeWidth="2" fill="none" stroke="yellow"   />
          )
        })
      }
      {
        props.imageRoutes.map((line) => {
          const b = line.map((l, index) => {
              return l.map(p => (`${p.get('x')},${p.get('y')}`))
          }).toJS().join(" ");
          return (
            <polyline points={b} strokeWidth="2" fill="none" stroke="red"   />
          )
        })
      }
    </svg>
  )
};

export default Canvas;