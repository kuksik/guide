import React, { Component } from 'react';
import Immutable from 'immutable';

class Canvas extends Component{
  constructor(props) {
    super(props)
    this.state = {
      isDrawing: false,
      future: new Immutable.List(),
      history: new Immutable.List(),
      drawingLine: new Immutable.List(),
    }
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
      drawingLine: prevState.drawingLine.push(new Immutable.List([point])),
    }));
    if (this.state.future.size > 0) {
      this.setState({future: Immutable.List()});
    }
    if (! this.state.drawing) {
        this.setState({history: this.state.history.push(this.state.drawingLine)});
    }
  }
  undo =  () => {
    if (this.state.history.size < 1) return;
    this.setState(prevState => {
      const history = prevState.history.pop();
      return {
        history,
        future: prevState.future.push(prevState.drawingLine),
        drawingLine: history.size === 0 ? new Immutable.List() : history.last(),
    }});
  }
  redo = () => {
    if (this.state.future.size < 1) return;
    this.setState({
      future: this.state.future.pop(),
      drawingLine: this.state.future.last(),
      history: this.state.history.push(this.state.drawingLine),
    });
  }
  buttonClick = (e) => {
    const { isDrawing } = this.state;
    if (isDrawing) {
      this.props.updateSelectedRouteLine({ line: this.state.drawingLine.toJS() });
      this.setState(prevState => ({
        isDrawing: !isDrawing,
        future: new Immutable.List(),
        history: new Immutable.List(),
        drawingLine: new Immutable.List(),
      }));
    } else {
      this.setState({ isDrawing: !isDrawing });
    }
  }
  renderRouteAssigns = () => {
    const routes = [...this.props.imageRoutes, this.props.selectedRoute];
    return routes.filter(({ line }) => !!line).map(({ sign, line }, index) => {
      const positionShift = 10;
      const x = line[0][0].x - positionShift;
      const y = line[0][0].y - positionShift;
      return <div key={index} className="route_sign" style={{top:`${y}px`, left:`${x}px`}}>{sign}</div>
    })
  }
  renderPanel = () => {
    return (
      <div className='image_panel'>
        <button onClick={this.buttonClick} >
          {this.state.isDrawing ? 'save' : 'start' }
        </button>
        <button
          onClick={this.undo} 
          disabled={this.state.history.size < 1}
        >
          undo
        </button>
        <button
          onClick={this.redo}
          disabled={this.state.future.size < 1}
        >
          redo
        </button>
      </div>
    )
  }
  getImageLines = () => {
    return this.props.imageRoutes.filter(({ line }) => !!line).map(({ line }) => {
      return Immutable.fromJS(line)
    });
  }
  getSelectedLine = () => {
    if (this.props.selectedRoute && this.props.selectedRoute.line) {
      return Immutable.fromJS(this.props.selectedRoute.line);
    }
    return new Immutable.List();
  }
  render(){
    return(
      <div>
        {this.renderPanel()}
        <div      
          id="drawArea"
          ref="drawArea"
          className="image"
          onMouseDown={this.handleMouseDown}
          style={{ backgroundImage: `url('${this.props.imageUrl}')` }}
        >
          {this.renderRouteAssigns()}
          <Drawing
            imageLines={this.getImageLines()}
            drawingLine={this.state.drawingLine}
            selectedLine={this.getSelectedLine()}
          />
        </div>
      </div>
    )
  }
}
const converLineToSvgFormat = (line) => (
  line.map((l, index) => (l.map(p => (`${p.get('x')},${p.get('y')}`)))).toJS().join(" ")
);
const Drawing = (props) => (
  <svg viewBox="0 0 900 900" className="drawing">
    {
      <polyline
        fill="none"
        strokeWidth="2"
        stroke="yellow"
        points={converLineToSvgFormat(props.drawingLine)} 
      />
    }
    {
      <polyline
      fill="none"
        strokeWidth="2"
        stroke="yellow"
        points={converLineToSvgFormat(props.selectedLine)}
      />
    }
    {
      props.imageLines.map((line, index) => (
        <polyline
          key={index}
          fill="none"
          strokeWidth="2"
          stroke="darkred"
          points={converLineToSvgFormat(line)}
        />
      ))
    }
  </svg>
);

export default Canvas;