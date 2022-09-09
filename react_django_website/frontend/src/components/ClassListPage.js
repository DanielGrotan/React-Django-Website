import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import React, { Component } from "react";
import { Link } from "react-router-dom";

class Create extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSaveButtonClick() {
    let names = document.getElementById("names").value.split("\n");
    names = names.filter(Boolean).map((name) => name.trim());

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.state.name,
        names: JSON.stringify(names),
      }),
    };

    fetch("/api/create-class-list", requestOptions)
      .then((response) => response.json())
      .then((data) => (document.location.href = "/"));
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "2em",
        }}
      >
        <TextField
          onChange={this.handleNameChange}
          label="Gi klasselisten et navn"
          style={{ width: "45ch" }}
        ></TextField>
        <TextField
          id="names"
          placeholder="Skriv hvert navn på sin egen linje"
          multiline
          rows={15}
          style={{ width: "45ch" }}
        ></TextField>
        <Button
          variant="contained"
          disabled={this.state.name === ""}
          onClick={this.handleSaveButtonClick}
        >
          Lagre Klasseliste
        </Button>
      </div>
    );
  }
}

class Edit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      names: this.props.names.join("\n"),
    };

    this.handleNamesChange = this.handleNamesChange.bind(this);
    this.handleUpdateButtonClick = this.handleUpdateButtonClick.bind(this);
  }

  handleNamesChange(event) {
    this.setState({ names: event.target.value });
  }

  handleUpdateButtonClick() {
    const requestOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: this.props.id,
        names: JSON.stringify(
          this.state.names
            .split("\n")
            .filter(Boolean)
            .map((name) => name.trim())
        ),
      }),
    };

    fetch("/api/create-class-list", requestOptions)
      .then((response) => response.json())
      .catch((err) => console.log(err))
      .then((data) => (document.location.href = "/"));
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "2em",
        }}
      >
        <TextField
          id="names"
          placeholder="Skriv hvert navn på sin egen linje"
          multiline
          value={this.state.names}
          onChange={this.handleNamesChange}
          rows={15}
          style={{ width: "45ch" }}
        ></TextField>
        <Button variant="contained" onClick={this.handleUpdateButtonClick}>
          Lagre Endringer
        </Button>
      </div>
    );
  }
}

export default class ClassListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      classLists: [],
      selectedClassList: "",
    };

    fetch("/api/account-status")
      .then((response) => response.json())
      .then((data) => {
        if (!data["Logged in"]) {
          document.location.href = "/logg-inn";
        }
      });

    this.handleClassListChange = this.handleClassListChange.bind(this);
    this.dynamicRender = this.dynamicRender.bind(this);
  }

  componentDidMount() {
    fetch("/api/get-class-lists")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          classLists: data,
        });
      });
  }

  handleClassListChange(event) {
    this.setState({ selectedClassList: event.target.value });
  }

  dynamicRender() {
    if (this.state.selectedClassList === -1) return <Create />;
    if (this.state.selectedClassList === "") return;
    const classList = this.state.classLists[this.state.selectedClassList];
    const classListFields = classList["fields"];
    return (
      <Edit
        id={classList["pk"]}
        names={JSON.parse(classListFields["names"])}
        key={this.state.selectedClassList}
      />
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
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "2em",
          }}
        >
          <FormControl>
            <InputLabel>Klasseliste</InputLabel>
            <Select
              value={this.state.selectedClassList}
              label="Klasseliste"
              onChange={this.handleClassListChange}
              style={{ width: "45ch" }}
            >
              {this.state.classLists.map((classList, index) => {
                return (
                  <MenuItem value={index} key={index}>
                    {classList["fields"]["name"]}
                  </MenuItem>
                );
              })}
              <MenuItem value={-1}>Lag ny klasseliste</MenuItem>
            </Select>
          </FormControl>
          {this.dynamicRender()}
        </div>
      </div>
    );
  }
}
