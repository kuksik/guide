import React, { Component } from 'react';
import Immutable from 'immutable';

class Canvas extends Component{
  constructor(props) {
    super(props)
    // console.log(props.route.line)
    // console.log(Immutable.List(props.route.line))
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

  componentDidMount() {
    if (!this.props.route) return null;
    this.props.firebase.storage().ref().child(this.props.route.picture).getDownloadURL().then((pictureUrl) => {
      this.setState({ pictureUrl })
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
    console.log('handleMouseDown')
    console.log(this.state)
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
      console.log(this.props);
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
    console.log(this)
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