import { Button, TextField } from "@mui/material";
import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class ClassListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
    };

    fetch("/api/account-status")
      .then((response) => response.json())
      .then((data) => {
        if (!data["Logged in"]) {
          document.location.href = "/logg-inn";
        }
      });

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
      .then((data) => document.location.href = "/");
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
          onChange={this.handleNameChange}
          label="Gi klasselisten et navn"
        ></TextField>
        <TextField
          id="names"
          placeholder="Skriv hvert navn på sin egen linje"
          multiline
          rows={15}
        ></TextField>
        <Button variant="contained" disabled={this.state.name === ""} onClick={this.handleSaveButtonClick}>
          Lagre Klasseliste
        </Button>
      </div>
    );
  }
}
