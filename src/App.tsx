import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { cyan, indigo } from '@material-ui/core/colors';
import { createBrowserHistory } from 'history';
import { Provider } from 'mobx-react';
import React from 'react';
import { BrowserRouter, Route, Router, Switch } from 'react-router-dom';
import './App.css';
import { Navigation } from './components/Navigation';
import { Comments } from './containers/Comments';
import { Stories } from './containers/Stories';
import ScrollToTop from './ScrollToTop';
import { appState } from './store/AppState';

const About = () => <h2>About</h2>;
const NotFound = () => <h2>404 Not Found!</h2>;

export const history = createBrowserHistory();
const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: cyan
  }
});

export class App extends BrowserRouter {
  render() {
    return (
      <Provider appState={appState}>
        <Router history={history}>
          <ScrollToTop>
            <MuiThemeProvider theme={theme}>
              <Navigation />
              <Switch>
                <Route path="/" exact component={Stories} />
                <Route path="/comment/:id" component={Comments} />
                <Route path="/about/" component={About} />
                <Route component={NotFound} />
              </Switch>
            </MuiThemeProvider>
          </ScrollToTop>
        </Router>
      </Provider>
    );
  }
}
