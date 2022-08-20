import { Button } from "@mui/material";
import React, { Component } from "react";

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

    handleTestClick(event) {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                rows: 2,
                columns: 4,
                table_positions: JSON.stringify([(4, 2), (1, 0), (0, 1)])
            })
        };

        fetch("/api/create-classroom-layout", requestOptions).then((response) => response.json()).then((data) => console.log(data));
    }

    render() {
        return (<div>
            <Button variant="contained" onClick={this.handleLogOutClick} style={{ position: "absolute", right: 5, top: 5 }}>Logg ut</Button>
            <Button variant="contained" style={{ position: "absolute", right: "51vw", top: "50vh" }}>Venstre</Button>
            <Button variant="contained" style={{ position: "absolute", left: "51vw", top: "50vh" }}>Høyre</Button>
            <Button variant="contained" onClick={this.handleTestClick}>Test</Button>
        </div>)
    }
}