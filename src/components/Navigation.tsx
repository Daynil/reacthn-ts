import { AppBar, Button, IconButton, Toolbar } from '@material-ui/core';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../react-logo.png';
import { appState } from '../store/AppState';
import './Navigation.css';

@observer
export class Navigation extends Component {
  render() {
    return (
      <div>
        <AppBar color="primary" position="static">
          <Toolbar>
            <Link
              to="/"
              className={
                appState.isLoading ? 'logo-link spin-load' : 'logo-link'
              }
            >
              <IconButton>
                <img src={logo} alt="React Logo" className="logo" />
              </IconButton>
            </Link>
            <span className="title">React HN</span>
            <div className="spacer" />
            <Link className="nav-button" to="/">
              <Button>Home</Button>
            </Link>
            <Link className="nav-button" to="/about/">
              <Button>About</Button>
            </Link>
            <Link className="nav-button" to="/users/">
              <Button>Users</Button>
            </Link>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
