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
      generatedNames: [],
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
      generatedNames: []
    });
  }

  handleClassListChange(event) {
    this.setState({
      classList: event.target.value,
      generatedNames: []
    });
  }

  handleGenerateButtonClick() {
    const classList = this.state.classLists.filter(
      (list) => list["name"] === this.state.classList
    )[0];
    const names = JSON.parse(classList["names"]);

    const namesShuffled = names.sort(() => 0.5 - Math.random());

    const classroomLayout = this.state.classroomLayouts.filter(
      (layout) => layout["name"] === this.state.classroomLayout
    )[0];
    const tablePositions = JSON.parse(classroomLayout["table_positions"]);

    const generatedNames = new Array();

    for (let i = 0; i < tablePositions.length; i++) {
      if (i > namesShuffled.length - 1) break;

      const x = tablePositions[i][0];
      const y = tablePositions[i][1];

      generatedNames.push([x, y, namesShuffled[i]]);
    }

    this.setState({
      generatedNames: generatedNames,
    });
  }

  createTable() {
    if (this.state.classroomLayout === "") return;

    const fields = this.state.classroomLayouts.filter(
      (layout) => layout["name"] === this.state.classroomLayout
    )[0];
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

    const nameGrid = new Array(rows);

    for (let i = 0; i < rows; i++) {
      nameGrid[i] = new Array(columns).fill("");
    }

    for (let i = 0; i < this.state.generatedNames.length; i++) {
      const x = this.state.generatedNames[i][0];
      const y = this.state.generatedNames[i][1];
      const name = this.state.generatedNames[i][2];
      nameGrid[x][y] = name;
    }

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
                      >
                        {nameGrid[row][column]}
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
      <div>
        <Button
          variant="contained"
          component={Link}
          to="/"
          style={{ position: "absolute", top: 5, right: 5 }}
        >
          Hjem
        </Button>
        <FormControl style={{ minWidth: 120 }}>
          <InputLabel>Klasserom</InputLabel>
          <Select
            value={this.state.classroomLayout}
            label="Klasserom"
            onChange={this.handleClassroomLayoutChange}
          >
            {this.state.classroomLayouts.map((layout, index) => {
              return (
                <MenuItem value={layout["name"]} key={index}>
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
          >
            {this.state.classLists.map((list, index) => {
              return (
                <MenuItem value={list["name"]} key={index}>
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
    );
  }
}
