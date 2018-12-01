import {
  AppBar,
  Button,
  Icon,
  IconButton,
  Switch,
  Toolbar
} from '@material-ui/core';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../react-logo.png';
import { AppState } from '../store/AppState';
import './Navigation.css';

@observer
export class Navigation extends Component<{ appState: AppState }> {
  flipLights(lightsOn: boolean) {
    this.props.appState.switchTheme(lightsOn);
  }

  render() {
    const { appState } = this.props;
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
              <Button>News</Button>
            </Link>
            <Link className="nav-button" to="/about/">
              <Button>About</Button>
            </Link>
            <Icon style={{ marginLeft: '20px' }}>brightness_3</Icon>
            <Switch
              checked={appState.uiThemeType === 'light'}
              onChange={e => this.flipLights(e.target.checked)}
            />
            <Icon>brightness_7</Icon>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
