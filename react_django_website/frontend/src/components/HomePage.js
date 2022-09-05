import { Button } from "@mui/material";
import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);

    fetch("/api/account-status")
      .then((response) => response.json())
      .then((data) => {
        if (!data["Logged in"]) {
          document.location.href = "/logg-inn";
        }
      });
  }

  handleLogOutClick(event) {
    fetch("/api/logout").then((_) => {
      document.location.href = "/logg-inn";
    });
  }

  render() {
    return (
      <div style={{ height: "100%" }}>
        <Button
          variant="contained"
          onClick={this.handleLogOutClick}
          style={{ position: "absolute", right: 5, top: 5 }}
        >
          Logg ut
        </Button>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            alignItems: "center",
            gap: "2em",
          }}
        >
          <Button
            variant="outlined"
            component={Link}
            to="/klasserom"
            style={{ padding: "1em 3em" }}
          >
            Lag Klasserom
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/klasseliste"
            style={{ padding: "1em 3em" }}
          >
            Lag Klasseliste
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/klassekart"
            style={{ padding: "1em 3em" }}
          >
            Generer Klassekart
          </Button>
        </div>
      </div>
    );
  }
}
