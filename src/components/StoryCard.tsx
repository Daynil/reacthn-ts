import {
  Card,
  CardContent,
  Icon,
  IconButton,
  Typography
} from '@material-ui/core';
import { sanitize } from 'dompurify';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Story } from '../store/AppState';
import {
  getAge,
  getCommentCount,
  getHeatIndex,
  parseDomain
} from '../util/util';
import './StoryCard.css';

@observer
export class StoryCard extends Component<{ story: Story }> {
  getSanitizedMarkup(dirtyString: string) {
    return {
      __html: sanitize(dirtyString)
    };
  }

  getStoryText(text: string) {
    return text ? (
      <span>
        <span dangerouslySetInnerHTML={this.getSanitizedMarkup(text)} />
      </span>
    ) : null;
  }

  render() {
    const { story } = this.props;
    if (!story) return null;
    return (
      <Card className="card">
        <div className="heat-index" style={getHeatIndex(story)} />
        <CardContent className={!false ? 'score' : 'score comments'}>
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
            <Typography variant="subheading" color="secondary">
              {parseDomain(story.url)}
            </Typography>
          </div>
          <Typography
            variant="subheading"
            color="secondary"
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
          {/* {story.children &&
        <Typography>
          {this.getStoryText(story.text)}
        </Typography>
        } */}
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
