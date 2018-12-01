import { MuiThemeProvider } from '@material-ui/core';
import { createBrowserHistory } from 'history';
import { observer, Provider } from 'mobx-react';
import React from 'react';
import { BrowserRouter, Route, Router, Switch } from 'react-router-dom';
import './App.css';
import { Navigation } from './components/Navigation';
import { About } from './containers/About';
import { Comments } from './containers/Comments';
import { Stories } from './containers/Stories';
import ScrollToTop from './ScrollToTop';
import { appState } from './store/AppState';

const NotFound = () => <h2>404 Not Found!</h2>;

export const history = createBrowserHistory();

@observer
export class App extends BrowserRouter {
  render() {
    return (
      <Provider appState={appState}>
        <Router history={history}>
          <ScrollToTop>
            <MuiThemeProvider theme={appState.uiTheme}>
              <div
                style={{
                  backgroundColor: appState.uiTheme.palette.background.default,
                  minHeight: '100vh'
                }}
              >
                <Navigation appState={appState} />
                <Switch>
                  <Route path="/" exact component={Stories} />
                  <Route path="/comment/:id" component={Comments} />
                  <Route path="/about/" component={About} />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </MuiThemeProvider>
          </ScrollToTop>
        </Router>
      </Provider>
    );
  }
}
