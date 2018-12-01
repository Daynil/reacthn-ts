import {
  Card,
  CardContent,
  Icon,
  IconButton,
  Typography
} from '@material-ui/core';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Story } from '../store/AppState';
import { getAge, getCommentCount, getIsHot, parseDomain } from '../util/util';
import './StoryCard.css';

export class StoryCard extends Component<{ story: Story }> {
  render() {
    const story = this.props.story;
    if (!story) return null;
    return (
      <Card className="card">
        <div className={getIsHot(story) ? 'heat-index hot' : 'heat-index'} />
        <CardContent className="score">
          <Typography variant="h5">{story.base.points}</Typography>
        </CardContent>
        <CardContent className="middle">
          <div>
            <Typography variant="h5">
              {story.base.url ? (
                <a href={story.base.url} target="_blank" className="story-link">
                  {story.base.title}
                </a>
              ) : (
                story.base.title
              )}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {parseDomain(story.base.url)}
            </Typography>
          </div>
          <Typography
            variant="subtitle1"
            color="textSecondary"
            className="extra-info"
          >
            by{' '}
            <a
              href={`https://news.ycombinator.com/user?id=${story.base.author}`}
              target="_blank"
              className="author"
            >
              {story.base.author}
            </a>{' '}
            {getAge(story.base.created_at)}
          </Typography>
        </CardContent>
        <div className="spacer" />
        <CardContent>
          <div className="comment-container">
            <Link to={`/comment/${story.base.id}`} className="comment-button">
              <IconButton>
                <Icon color="primary">comment</Icon>
              </IconButton>
            </Link>
            <Typography variant="subtitle1">
              {story.children ? getCommentCount(story.children) : 0}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }
}
