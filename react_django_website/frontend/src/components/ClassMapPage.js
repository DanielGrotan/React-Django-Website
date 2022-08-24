import { Button } from "@mui/material";
import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class ClassMapPage extends Component {
  constructor(props) {
    super(props);

    fetch("/api/account-status").then((response) => response.json()).then((data) => {
        if (!data["Logged in"]) {
            document.location.href = "/logg-inn"
        }
    })
  }

  render() {
    return (
      <div>
        <Button variant="contained" component={Link} to="/" style={{ position: "absolute", top: 5, right: 5 }}>Hjem</Button>
        <p>This is the class map page</p>
      </div>
    );
  }
}
