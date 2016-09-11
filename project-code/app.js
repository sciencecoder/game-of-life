import React from 'react';
import ReactDOM from 'react-dom';
import Cell from './cell';
require('./styles.scss');

//to run script remember to use webpack-dev-server --progress --colors --host $IP --port $PORT

var rows = [];
var cols=[];

for (var i = 1; i <= 50; i++) {
  rows.push(i);
}
for (var i = 1; i <= 70; i++) {
  cols.push(i);
}


class TableRow extends React.Component {
  initCellStat() {
    return Math.floor(((Math.random() * 10) + 1));
  };
  render() {
    return (
      <tr>
        {cols.map((num) => {
          var initialStat = this.initCellStat();
          return <Cell
            key={'cell' + num * this.props.rowNum} 
            ref={'cell' + num * this.props.rowNum}
            cellName={'cell' + num * this.props.rowNum}    
            cellNum={num * this.props.rowNum}
            rowName={this.props.rowName}   
            boardCoordinates={{row: this.props.rowNum, column: num}}
            initialStatus={initialStat}
            gameStatus={this.props.gameStatus}
            gameUpdate={this.props.gameUpdate}
            neighborIsAlive={this.props.neighborIsAlive}
            />;
        })}
      </tr>
    )
  };

}
class Board extends React.Component {
  state = {
    gameStatus: false,
    gameUpdate: false,
    generations: 0
  };
  neighborIsAlive = (neighborRowName, neighborCellName) => {
    var neighborCell = this.refs[neighborRowName].refs[neighborCellName];
    if (neighborCell.state.alive) {
      return true;
    }
    return false;
  };
  updateBoard = () => {
    var prevStat = this.state.gameUpdate;
    var prevGen = this.state.generations;
    this.setState({
      gameStatus: true,
      gameUpdate: !prevStat,
      generations: prevGen + 1
    });
  };
  startGame = () => {
    this.interval = setInterval(this.updateBoard, 1);
  };
  pauseGame = () => {
    clearInterval(this.interval);
    var prevGen = this.state.generations;
    this.setState({
      gameStatus: false,
      gameUpdate: false,
      generations: prevGen
    });
  };
  clearBoard = () => {
    clearInterval(this.interval);
    for (var i = 1; i <= 50; i++) {
      for (var j = 1; j <= 70; j++) {
        var row = 'row' + i.toString();
        var cell = 'cell' + (j * i).toString();
        this.refs[row].refs[cell].setState({
          color: {},
          alive: false,
          neighborStatusArr: [false, false, false, false, false, false, false, false],
          liveNeighbors: 0,
          cellShouldUpdate: true
        });
      }
    }
    
     this.setState({
      gameStatus: false,
      gameUpdate: false,
      generations: 0
    });
  };
  componentDidMount() {
    this.interval = setInterval(this.updateBoard, 1);
  };
  render() {
    return (<div>
        <div id='controls'>
          <button onClick={this.startGame}>Start</button>
          <button onClick={this.pauseGame}>Pause</button>
          <button onClick={this.clearBoard}>Clear</button>
          <div>Generations: {this.state.generations}</div>
        </div>
      <table id='game-board'>
        {rows.map((num) => {
          return <TableRow
            key={'row' + num}
            ref={'row' + num}
            rowName={'row' + num}
            rowNum={num}
            gameStatus={this.state.gameStatus}
            gameUpdate={this.state.gameUpdate}
            neighborIsAlive={this.neighborIsAlive} />;
        })}
      </table>
    </div>)
  }

}

ReactDOM.render(<Board />, document.getElementById('game-container'));