import { sanitize } from 'dompurify';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { AppState, Comment } from '../store/AppState';
import { getAge, getCommentCount } from '../util/util';
import './CommentCard.css';

@inject('appState')
@observer
export class CommentCard extends Component<{
  comment: Comment;
  isHidden: boolean;
  level: number;
  appState?: AppState;
}> {
  offsetFactor = 40;

  getSanitizedMarkup(dirtyString: string) {
    return {
      __html: sanitize(dirtyString)
    };
  }

  getStoryText(comment: Comment) {
    return !comment.minimized ? (
      <span>
        <span
          dangerouslySetInnerHTML={this.getSanitizedMarkup(comment.base.text)}
        />
      </span>
    ) : null;
  }

  getMinTitle = (minimized: boolean) => {
    return !minimized ? 'comment-box' : 'comment-box minimized';
  };

  onMinimizeClick(e: React.MouseEvent<HTMLSpanElement>) {
    console.log('just testing', e.target);
    this.props.comment.toggleMinimized();
  }

  render() {
    const { comment, isHidden, level } = this.props;
    return comment.base.text && !isHidden ? (
      <div
        className={this.getMinTitle(comment.minimized)}
        style={{ marginLeft: `${level * this.offsetFactor}px` }}
      >
        <div>
          <span className="comment-title">
            <span>
              <a
                href={`https://news.ycombinator.com/user?id=${
                  comment.base.author
                }`}
                target="_blank"
                className="author"
              >
                {comment.base.author}
              </a>
            </span>
            <span> {getAge(comment.base.created_at)}</span>
            <span onClick={e => this.onMinimizeClick(e)} className="min-button">
              {!comment.minimized ? (
                <span>[ - ]</span>
              ) : (
                <span>
                  [ + {comment.minimized && getCommentCount(comment.children)} ]
                </span>
              )}
            </span>
          </span>
          <span className="body">{this.getStoryText(comment)}</span>
        </div>
      </div>
    ) : null;
  }
}
