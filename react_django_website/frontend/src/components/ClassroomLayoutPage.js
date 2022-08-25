import { Button, TextField } from "@mui/material";
import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class ClassroomLayoutPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      rows: "2",
      columns: "2",
      grid: [
        [false, false],
        [false, false],
      ],
    };

    fetch("/api/account-status")
      .then((response) => response.json())
      .then((data) => {
        if (!data["Logged in"]) {
          document.location.href = "/logg-inn";
        }
      });

    this.handleRowsChange = this.handleRowsChange.bind(this);
    this.handleColumnsChange = this.handleColumnsChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
    this.createTable = this.createTable.bind(this);
  }

  handleRowsChange(event) {
    const value = Number(event.target.value);
    const rows = value === 0 ? "" : Math.min(15, Math.max(1, value));

    const grid = new Array(rows);

    for (let i = 0; i < rows; i++) {
      grid[i] = new Array(Number(this.state.columns)).fill(false);
    }

    this.setState({
      rows: rows.toString(),
      grid: grid,
    });
  }

  handleColumnsChange(event) {
    const value = Number(event.target.value);

    this.setState({
      columns: value === 0 ? "" : Math.min(15, Math.max(1, value)).toString(),
    });
  }

  handleButtonClick(row, column) {
    let grid = [...this.state.grid];
    grid[row][column] = !grid[row][column];

    this.setState({
      grid: grid,
    });
  }

  handleNameChange(event) {
    this.setState({
      name: event.target.value,
    });
  }

  handleSaveButtonClick() {
    const rows = Number(this.state.rows);
    const columns = Number(this.state.columns);

    const tablePositions = new Array();

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (this.state.grid[i][j]) {
          tablePositions.push([i, j]);
        }
      }
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.state.name,
        rows: this.state.rows,
        columns: this.state.columns,
        table_positions: JSON.stringify(tablePositions),
      }),
    };

    fetch("/api/create-classroom-layout", requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  createTable() {
    const { innerWidth: width, innerHeight: height } = window;

    const buttonWidth = (width * 0.9) / Number(this.state.columns) + "px";
    const buttonHeight = (height * 0.6) / Number(this.state.rows) + "px";

    return (
      <tbody>
        {[...Array(Number(this.state.rows))].map((value, row) => (
          <tr key={row}>
            {[...Array(Number(this.state.columns))].map((value, column) => (
              <td key={column}>
                <Button
                  variant={
                    this.state.grid[row][column] ? "contained" : "outlined"
                  }
                  style={{
                    width: "100px",
                    height: "50px",
                    maxWidth: buttonWidth,
                    maxHeight: buttonHeight,
                  }}
                  onClick={() => this.handleButtonClick(row, column)}
                ></Button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  render() {
    return (
      <div>
        <Button
          variant="contained"
          component={Link}
          to="/"
          style={{ position: "absolute", top: 5, right: 5 }}
        >
          Hjem
        </Button>
        <TextField
          type="number"
          inputProps={{ min: 1, max: 15, style: { textAlign: "center" } }}
          onChange={this.handleRowsChange}
          value={this.state.rows}
          label="Rader"
          style={{ marginTop: "10px" }}
        />
        <TextField
          type="number"
          inputProps={{ min: 1, max: 15, style: { textAlign: "center" } }}
          onChange={this.handleColumnsChange}
          value={this.state.columns}
          label="Kolonner"
          style={{ marginTop: "10px" }}
        />
        <table style={{ paddingLeft: 10 }}>{this.createTable()}</table>
        <TextField onChange={this.handleNameChange}>
          {this.state.name}
        </TextField>
        <Button variant="contained" onClick={this.handleSaveButtonClick}>
          Lagre Klasserom
        </Button>
      </div>
    );
  }
}
