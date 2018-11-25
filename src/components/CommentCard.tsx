import { sanitize } from 'dompurify';
import React, { Component } from 'react';
import { Comment } from '../store/AppState';
import { getAge } from '../util/util';
import './CommentCard.css';

export class CommentCard extends Component<{
  comment: Comment;
  isHidden: boolean;
  level: number;
}> {
  offsetFactor = 40;

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

  getMinTitle = (minimized: boolean) => {
    return !minimized ? 'comment' : 'comment minimized';
  };

  render() {
    const { comment, isHidden, level } = this.props;
    return comment.text && !isHidden ? (
      <div style={{ marginLeft: `${level * this.offsetFactor}px` }}>
        <div className="comment-box">
          <span className="comment-title">
            <span>
              <a
                href={`https://news.ycombinator.com/user?id=${comment.author}`}
                target="_blank"
                className="author"
              >
                {comment.author}
              </a>
            </span>
            <span> {getAge(comment.created_at)}</span>
            {/* <span className="min-button">
            {!comment.minimized ?
              <span>[ - ]</span> :
              <span>[ + {comment.minimized && getCommentCount(comment.children)} ]</span>
            }
          </span> */}
          </span>
          <span className="body">{this.getStoryText(comment.text)}</span>
        </div>
      </div>
    ) : null;
  }
}
