import { Button } from "@mui/material";
import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class HomePage extends Component {
    constructor(props) {
        super(props);

        fetch("/api/account-status").then((response) => response.json()).then((data) => {
            if (!data["Logged in"]) {
                document.location.href = "/logg-inn"
            }
        })
    }

    handleLogOutClick(event) {
        fetch("/api/logout").then((_) => {
            document.location.href = "/logg-inn"
        });
    }

    render() {
        return (<div>
            <Button variant="contained" onClick={this.handleLogOutClick} style={{ position: "absolute", right: 5, top: 5 }}>Logg ut</Button>
            <Button variant="outlined" component={Link} to="/klasserom">Lag Klasserom</Button>
            <Button variant="outlined" component={Link} to="/klasseliste">Lag Klasseliste</Button>
            <Button variant="outlined" component={Link} to="/klassekart">Generer Klassekart</Button>
        </div>)
    }
}