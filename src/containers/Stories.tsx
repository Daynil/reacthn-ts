import { Button, CircularProgress } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { StoryCard } from '../components/StoryCard';
import { AppState } from '../store/AppState';
import './Stories.css';

@inject('appState')
@observer
export class Stories extends Component<{ appState: AppState }> {
  componentDidMount() {
    if (this.props.appState.stories.length) return;
    this.props.appState.getStories(true);
  }

  getMoreStories() {
    if (this.props.appState.isLoading) return;
    this.props.appState.getStories(true);
  }

  storyList() {
    return this.props.appState.stories.map(story => (
      <StoryCard key={story.base.id} story={story} />
    ));
  }

  render() {
    const { appState } = this.props;
    return (
      <div className="stories-wrap">
        {this.storyList()}
        {appState.loadedStoryIds !== null && (
          <Button
            className="more-btn"
            color={appState.uiThemeType === 'light' ? 'primary' : 'secondary'}
            onClick={() => this.getMoreStories()}
          >
            Load more
            {appState.isLoading && (
              <CircularProgress
                className="load-spinner"
                color={
                  appState.uiThemeType === 'light' ? 'primary' : 'secondary'
                }
              />
            )}
          </Button>
        )}
      </div>
    );
  }
}
