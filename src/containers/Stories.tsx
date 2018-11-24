import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { StoryCard } from '../components/StoryCard';
import { appState } from '../store/AppState';

@observer
export class Stories extends Component {
  componentDidMount() {
    appState.getStories(true);
  }

  storyList() {
    return appState.stories.map((story, i) => (
      <StoryCard key={i} story={story} />
    ));
  }

  render() {
    return (
      <div
        style={{
          width: '75%',
          margin: '0 auto'
        }}
      >
        {this.storyList()}
      </div>
    );
  }
}
