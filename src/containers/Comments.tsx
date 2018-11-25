import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { CommentCard } from '../components/CommentCard';
import { StoryCard } from '../components/StoryCard';
import { appState, Comment } from '../store/AppState';

const generateCommentChain = (isHidden: boolean, levelOfRecursion: number) => {
  return (comment: Comment, index: number) => (
    <CommentWrap
      key={index}
      comment={comment}
      isHidden={isHidden}
      level={levelOfRecursion}
    />
  );
};

/**
 * Recursive wrapper component over CommentCard
 */
const CommentWrap = (props: {
  comment: Comment;
  isHidden: boolean;
  level: number;
}) => {
  const { comment, isHidden, level } = props;
  let nestedComments;
  if (comment.children.length > 0) {
    const childLevel = level + 1;
    const childrenHidden = isHidden;
    nestedComments = comment.children.map(
      generateCommentChain(childrenHidden, childLevel)
    );
  }
  return (
    <div>
      <CommentCard comment={comment} isHidden={isHidden} level={level} />
      {nestedComments}
    </div>
  );
};

@observer
export class Comments extends Component<RouteComponentProps<{ id: string }>> {
  componentDidMount() {
    appState.selectStory(this.props.match.params.id);
  }

  render() {
    if (!appState.selectedStory || !appState.selectedStory.children)
      return null;
    const commentCardChain = appState.selectedStory.children.map(
      generateCommentChain(false, 0)
    );

    return (
      <div
        style={{
          width: '75%',
          margin: '0 auto'
        }}
      >
        <StoryCard story={appState.selectedStory} />
        <div style={{ padding: '0 10px 10px 10px' }}>{commentCardChain}</div>
      </div>
    );
  }
}
