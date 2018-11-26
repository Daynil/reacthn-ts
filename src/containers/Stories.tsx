import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { StoryCard } from '../components/StoryCard';
import { AppState } from '../store/AppState';

@inject('appState')
@observer
export class Stories extends Component<{ appState: AppState }> {
  componentDidMount() {
    this.props.appState.getStories(true);
  }

  storyList() {
    return this.props.appState.stories.map((story, i) => (
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
