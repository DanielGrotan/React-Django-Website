import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class ClassMapPage extends Component {
  constructor(props) {
    super(props);

    fetch("/api/account-status")
      .then((response) => response.json())
      .then((data) => {
        if (!data["Logged in"]) {
          document.location.href = "/logg-inn";
        }
      });

    this.state = {
      classroomLayouts: [],
      classLists: [],
      classroomLayout: "",
      classList: "",
      nameGrid: null,
      selected: null,
    };

    this.handleClassroomLayoutChange =
      this.handleClassroomLayoutChange.bind(this);
    this.handleClassListChange = this.handleClassListChange.bind(this);
    this.handleGenerateButtonClick = this.handleGenerateButtonClick.bind(this);
  }

  componentDidMount() {
    fetch("/api/get-classroom-layouts")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          classroomLayouts: data.map((layout) => layout["fields"]),
        });
      });

    fetch("/api/get-class-lists")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ classLists: data.map((list) => list["fields"]) });
      });
  }

  handleClassroomLayoutChange(event) {
    this.setState({
      classroomLayout: event.target.value,
      nameGrid: null,
      selected: null,
    });
  }

  handleClassListChange(event) {
    this.setState({
      classList: event.target.value,
      nameGrid: null,
      selected: null,
    });
  }

  handleGenerateButtonClick() {
    const classList = this.state.classLists[this.state.classList];
    const names = JSON.parse(classList["names"]);

    const namesShuffled = names.sort(() => 0.5 - Math.random());

    const classroomLayout =
      this.state.classroomLayouts[this.state.classroomLayout];
    const tablePositions = JSON.parse(classroomLayout["table_positions"]);

    const layout = this.state.classroomLayouts[this.state.classroomLayout];

    const nameGrid = new Array(Number(layout["rows"]));

    for (let i = 0; i < Number(layout["rows"]); i++) {
      nameGrid[i] = new Array(Number(layout["columns"])).fill("");
    }

    for (let i = 0; i < tablePositions.length; i++) {
      if (i > namesShuffled.length - 1) break;

      const x = tablePositions[i][0];
      const y = tablePositions[i][1];

      nameGrid[x][y] = namesShuffled[i];
    }

    this.setState({
      nameGrid: nameGrid,
    });
  }

  handleButtonClick(row, column) {
    if (this.state.selected === null) {
      this.setState({
        selected: [row, column],
      });
    } else {
      if (this.state.nameGrid === null) return;
      const nameGrid = [...this.state.nameGrid];
      const temp = nameGrid[row][column];

      const x = this.state.selected[0];
      const y = this.state.selected[1];

      nameGrid[row][column] = nameGrid[x][y];
      nameGrid[x][y] = temp;

      this.setState({
        nameGrid: nameGrid,
        selected: null,
      });
    }
  }

  createTable() {
    if (this.state.classroomLayout === "") return;

    const fields = this.state.classroomLayouts[this.state.classroomLayout];
    const rows = Number(fields["rows"]);
    const columns = Number(fields["columns"]);
    const tablePositions = JSON.parse(fields["table_positions"]);

    const grid = new Array(rows);

    for (let i = 0; i < rows; i++) {
      grid[i] = new Array(columns).fill(false);
    }

    for (let i = 0; i < tablePositions.length; i++) {
      const row = tablePositions[i][0];
      const column = tablePositions[i][1];

      grid[row][column] = true;
    }

    const nameGrid = this.state.nameGrid;

    return (
      <table>
        <tbody>
          {[...Array(rows)].map((value, row) => {
            return (
              <tr key={row}>
                {[...Array(columns)].map((value, column) => {
                  return (
                    <td key={column}>
                      <Button
                        variant={grid[row][column] ? "contained" : "outlined"}
                        style={{ width: "100px", height: "50px" }}
                        onClick={
                          grid[row][column]
                            ? () => this.handleButtonClick(row, column)
                            : () => {}
                        }
                      >
                        {nameGrid === null ? "" : nameGrid[row][column]}
                      </Button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div style={{ height: "100%" }}>
        <Button
          variant="contained"
          component={Link}
          to="/"
          style={{ position: "absolute", top: 5, right: 5 }}
        >
          Hjem
        </Button>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "2em" }}>
        <FormControl style={{ minWidth: 120 }}>
          <InputLabel>Klasserom</InputLabel>
          <Select
            value={this.state.classroomLayout}
            label="Klasserom"
            onChange={this.handleClassroomLayoutChange}
            style={{ width: "45ch" }}
          >
            {this.state.classroomLayouts.map((layout, index) => {
              return (
                <MenuItem value={index} key={index}>
                  {layout["name"]}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl style={{ minWidth: 120 }}>
          <InputLabel>Klasseliste</InputLabel>
          <Select
            value={this.state.classList}
            label="Klasseliste"
            onChange={this.handleClassListChange}
            style={{ width: "45ch" }}
          >
            {this.state.classLists.map((list, index) => {
              return (
                <MenuItem value={index} key={index}>
                  {list["name"]}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        {this.createTable()}
        <Button
          disabled={
            this.state.classroomLayout === "" || this.state.classList === ""
          }
          variant="contained"
          onClick={this.handleGenerateButtonClick}
        >
          Generer Klassekart
        </Button>
        </div>
      </div>
    );
  }
}
