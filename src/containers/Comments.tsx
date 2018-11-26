import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { CommentCard } from '../components/CommentCard';
import { StoryCard } from '../components/StoryCard';
import { AppState, Comment } from '../store/AppState';

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
const CommentWrap = observer(
  (props: { comment: Comment; isHidden: boolean; level: number }) => {
    const { comment, isHidden, level } = props;
    let nestedComments;
    if (comment.children.length > 0) {
      const childLevel = level + 1;
      const childrenHidden = isHidden || comment.minimized;
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
  }
);

interface RouteAndState extends RouteComponentProps<{ id: string }> {
  appState: AppState;
}

@inject('appState')
@observer
export class Comments extends Component<
  RouteAndState,
  { commentChain: JSX.Element[] }
> {
  constructor(props: RouteAndState) {
    super(props);
    this.state = {
      commentChain: []
    };
  }

  componentDidMount() {
    this.props.appState.setLoading(true);
    this.props.appState.selectStory(this.props.match.params.id);

    const commentCardChain = this.props.appState.selectedStory!.children.map(
      generateCommentChain(false, 0)
    );

    // Give component a moment to render initial page and story info prior to deep comment render
    setTimeout(
      () =>
        this.setState({ commentChain: commentCardChain }, () =>
          this.props.appState.setLoading(false)
        ),
      1
    );
  }

  render() {
    if (!this.props.appState.selectedStory) return null;

    return (
      <div
        style={{
          width: '75%',
          margin: '0 auto'
        }}
      >
        <StoryCard story={this.props.appState.selectedStory} />
        <div style={{ padding: '0 10px 10px 10px' }}>
          {this.state.commentChain}
        </div>
      </div>
    );
  }
}
