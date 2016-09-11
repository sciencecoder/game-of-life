import React from 'react';

class Cell extends React.Component {
  state = {
    color: this.props.initialStatus > 7 ? {
      backgroundColor: 'red'
    } : {},
    alive: this.props.initialStatus > 7 ? true : false,
    neighborStatusArr: [false, false, false, false, false, false, false, false],
    liveNeighbors: 0
  };
  setCellState = (color, alive, neighborStatusArr, gameStatus) => {
    this.setState({
      color: color,
      alive: alive,
      neighborStatusArr: neighborStatusArr,
      liveNeighbors: neighborStatusArr.filter((b) => b).length,
      cellShouldUpdate: gameStatus
    });
  };
  update = (index, neighborStatus) => {
    var color = this.state.color;
    var alive = this.state.alive;
    var neighborStatusArr = this.state.neighborStatusArr;
    neighborStatusArr[index] = neighborStatus;
    this.setCellState(color, alive, neighborStatusArr);
  };
  coords = () => {
    return this.props.boardCoordinates;
  };
  getNeighborStatus = (row, name, neighborIndex) => {
    if (this.props.neighborIsAlive(row, name)) {
      this.update(neighborIndex, true);
    } else {
      this.update(neighborIndex, false);
    }
  };
  topLeftNeighbor = () => {
    if (this.coords().row > 1 && this.coords().column > 1) {
      var neighborRow = 'row' + (this.coords().row - 1);
      var neighborName = 'cell' + ((this.coords().column - 1) * (this.coords().row - 1));
      this.getNeighborStatus(neighborRow, neighborName, 0);
    }
  };
  topNeighbor = () => {
    if (this.coords().row > 1) {
      var neighborRow = 'row' + (this.coords().row - 1);
      var neighborName = 'cell' + (this.coords().column * (this.coords().row - 1));
      this.getNeighborStatus(neighborRow, neighborName, 1);
    }
  };
  topRightNeighbor = () => {
    if (this.coords().row > 1 && this.coords().column < 70) {
      var neighborRow = 'row' + (this.coords().row - 1);
      var neighborName = 'cell' + ((this.coords().column + 1) * (this.coords().row - 1));
      this.getNeighborStatus(neighborRow, neighborName, 2);
    }
  };
  rightNeighbor = () => {
    if (this.coords().column < 70) {
      var neighborName = 'cell' + ((this.coords().column + 1) * this.coords().row);
      this.getNeighborStatus(this.props.rowName, neighborName, 3);
    }
  };
  bottomRightNeighbor = () => {
    if (this.coords().row < 50 && this.coords().column < 70) {
      var neighborName = 'cell' + ((this.coords().column + 1) * (this.coords().row + 1));
      var neighborRow = 'row' + (this.coords().row + 1);
      this.getNeighborStatus(neighborRow, neighborName, 4);
    }
  };
  bottomNeighbor = () => {
    if (this.coords().row < 50) {
      var neighborName = 'cell' + (this.coords().column * (this.coords().row + 1));
      var neighborRow = 'row' + (this.coords().row + 1);
      this.getNeighborStatus(neighborRow, neighborName, 5);
    }
  };
  bottomLeftNeighbor = () => {
    if (this.coords().row < 50 && this.coords().column > 1) {
      var neighborName = 'cell' + ((this.coords().column - 1) * (this.coords().row + 1));
      var neighborRow = 'row' + (this.coords().row + 1);
      this.getNeighborStatus(neighborRow, neighborName, 6);
    }
  };
  leftNeighbor = () => {
    if (this.coords().column > 1) {
      var neighborName = 'cell' + ((this.coords().column - 1) * this.coords().row);
      this.getNeighborStatus(this.props.rowName, neighborName, 7);
    }
  };
  allNeighbors = () => {
    this.topLeftNeighbor();
    this.topNeighbor();
    this.topRightNeighbor();
    this.rightNeighbor();
    this.bottomRightNeighbor();
    this.bottomNeighbor();
    this.bottomLeftNeighbor();
    this.leftNeighbor();
  };
  reviveCell = () => {
    var color = {
      backgroundColor: 'red'
    };
    var alive = true;
    var neighborStatusArr = this.state.neighborStatusArr;
    this.setCellState(color, alive, neighborStatusArr, true);
  };
  killCell = () => {
    var color = {};
    var alive = false;
    var neighborStatusArr = this.state.neighborStatusArr;
    this.setCellState(color, alive, neighborStatusArr, true);
  };
  handleClick = () => {
 if (this.props.gameStatus === false) {
      if (this.state.alive) {
        this.killCell();
      } else {
        this.reviveCell();
      }
    }
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.cellShouldUpdate || nextProps.gameUpdate !== this.props.gameUpdate) {
      return true;
    }
    return false;
  }
  componentDidUpdate() {
    //be carefull with infinitly calling setState and re-rendering components
if (this.props.gameUpdate) {
      this.allNeighbors();
      setTimeout(() => {
        if (this.state.liveNeighbors === 3 && this.state.alive === false) {
          this.reviveCell();
        } else if (this.state.liveNeighbors < 2 || this.state.liveNeighbors > 3 && this.state.alive) {
          this.killCell();
        }

      }, 1)
    }

  };
  render() {
    return <td onClick={this.handleClick} style={this.state.color} ></td>;
  }
}

export default Cell;