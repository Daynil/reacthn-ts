import { Typography } from '@material-ui/core';
import React, { Component } from 'react';

export class About extends Component {
  render() {
    return (
      <div
        style={{ width: 'fit-content', margin: '0 auto', marginTop: '50px' }}
      >
        <Typography variant="h4" gutterBottom>
          An alternate front end implementation of{' '}
          <a href="https://news.ycombinator.com/news" target="_blank">
            hacker news
          </a>
          .
        </Typography>
        <Typography variant="h5" gutterBottom>
          By{' '}
          <a href="https://github.com/Daynil/reacthn-ts" target="_blank">
            Danny Libin
          </a>
        </Typography>
        <Typography variant="subtitle1">
          <b>Technologies used:</b>
        </Typography>
        <Typography variant="subtitle1">
          <ul>
            <li>React</li>
            <li>create-react-app</li>
            <li>React-router</li>
            <li>Typescript</li>
            <li>material-ui</li>
            <li>MobX</li>
            <li>
              <a href="https://github.com/HackerNews/API" target="_blank">
                Hacker News API
              </a>
            </li>
            <li>
              <a href="https://hn.algolia.com/api" target="_blank">
                Algolia Search API
              </a>
            </li>
          </ul>
        </Typography>
      </div>
    );
  }
}
