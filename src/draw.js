import React, { Component } from 'react';
import Immutable from 'immutable';

class Canvas extends Component{
  state = {
    isDrawing: false,
    finishedLines: [],
    lines: new Immutable.List()
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
      this.setState(prevState => ({
        isDrawing: !isDrawing,
        lines: new Immutable.List(),
        finishedLines: [ ...prevState.finishedLines, prevState.lines ]
      }));
    } else {
      this.setState({ isDrawing: !isDrawing });
    }
  }
  render(){
    const style = {
      backgroundImage: `url('pictures/skulptura/01.jpg')`
      // 'url("https://drive.google.com/uc?id=1qqaxsJTW1aGQiyhMDkOj06csGVe6Ie8C")'
    }
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
          className="image"
          style={style}
          onMouseDown={this.handleMouseDown}
          // onDoubleClick={this.handleDoubleClick}
        >
          <Drawing
            lines={this.state.lines}
            finishedLines={this.state.finishedLines}
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
  console.log(props)
  return(
    <svg className="drawing">
      <polyline points={a}  strokeWidth="5" fill="none" stroke="red"   />
      {
        props.finishedLines.map((line) => {
          const b = line.map((l, index) => {
              return l.map(p => (`${p.get('x')},${p.get('y')}`))
          }).toJS().join(" ");
          return (
            <polyline points={b} strokeWidth="5" fill="none" stroke="red"   />
          )
        })
      }
    </svg>
  )
};

export default Canvas;