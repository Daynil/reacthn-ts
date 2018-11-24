import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import { Navigation } from './components/Navigation';
import { Stories } from './containers/Stories';

const Index = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;
const Users = () => <h2>Users</h2>;

export class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navigation />
          <Route path="/" exact component={Stories} />
          <Route path="/about/" component={About} />
          <Route path="/users/" component={Users} />
        </div>
      </Router>
    );
  }
}
