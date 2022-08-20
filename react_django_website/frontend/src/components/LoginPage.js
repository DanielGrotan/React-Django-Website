import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { Component } from "react";

const theme = createTheme();

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: "",
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value, error: "" });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value, error: "" });
  }

  handleSubmit(event) {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    };
    fetch("/api/login", requestOptions)
      .then((response) => {
        if (response.status == 200) {
          document.location.href = "/";
        }

        return response.json();
      })
      .then((data) => this.setState({ error: data["Error"] }));
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            minHeight="100vh"
          >
            <Typography component="h1" variant="h5">
              Logg inn
            </Typography>
            <Box
              component="form"
              onSubmit={this.handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Brukernavn"
                name="username"
                autoComplete="off"
                autoFocus
                error={this.state.error !== ""}
                helperText={this.state.error !== "" ? this.state.error : " "}
                onChange={this.handleUsernameChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                label="Passord"
                type="password"
                name="password"
                onChange={this.handlePasswordChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={
                  this.state.username === "" || this.state.password === ""
                }
                sx={{ mt: 3, mb: 2 }}
              >
                Logg inn
              </Button>
              <Grid container>
                <Grid item xs align="right">
                  <Typography variant="body2">
                    Har du ikke konto? <a href="registrer">Registrer deg</a>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}
