import {
  Card,
  CardContent,
  Icon,
  IconButton,
  Typography
} from '@material-ui/core';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Story } from '../store/AppState';
import { getAge, getCommentCount, getIsHot, parseDomain } from '../util/util';
import './StoryCard.css';

@observer
export class StoryCard extends Component<{ story: Story }> {
  render() {
    const { story } = this.props;
    if (!story) return null;
    return (
      <Card className="card">
        <div className={getIsHot(story) ? 'heat-index hot' : 'heat-index'} />
        <CardContent className="score">
          <Typography variant="headline">{story.points}</Typography>
        </CardContent>
        <CardContent className="middle">
          <div>
            <Typography variant="headline">
              {story.url ? (
                <a href={story.url} target="_blank" className="story-link">
                  {story.title}
                </a>
              ) : (
                story.title
              )}
            </Typography>
            <Typography variant="subheading" color="textSecondary">
              {parseDomain(story.url)}
            </Typography>
          </div>
          <Typography
            variant="subheading"
            color="textSecondary"
            className="extra-info"
          >
            by{' '}
            <a
              href={`https://news.ycombinator.com/user?id=${story.author}`}
              target="_blank"
              className="author"
            >
              {story.author}
            </a>{' '}
            {getAge(story.created_at)}
          </Typography>
        </CardContent>
        <div className="spacer" />
        <CardContent>
          <div className="comment-container">
            <Link to={`/comment/${story.id}`} className="comment-button">
              <IconButton>
                <Icon color="primary">comment</Icon>
              </IconButton>
            </Link>
            <Typography variant="subheading">
              {story.children ? getCommentCount(story.children) : 0}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }
}
