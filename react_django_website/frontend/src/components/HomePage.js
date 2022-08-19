import React, { Component } from "react";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null
        };

        fetch("/api/account-status").then((response) => response.json()).then((data) => {
            if (data.hasOwnProperty("username")) {
                this.setState({ username: data["username"] });
            }
        })
    }

    render() {
        let display;
        if (this.state.username !== null) {
            display = <h1>{this.state.username}</h1>
        } else {
            display = (<div>
                <a href="logg-inn">Logg inn</a>
                <a href="registrer">Registrer</a>
            </div>)
        }
        return display
    }
}