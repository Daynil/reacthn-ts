import moment from 'moment';
import { Comment, Story } from '../store/AppState';

export const getAge = (created: string) => {
  //2018-11-22T20:06:28.000Z
  let createdOn = moment(created);
  return createdOn.fromNow();
};

/**
 * Extract base url from full address
 */
export const parseDomain = (url: string) => {
  let re = new RegExp('^https?://?((www.)?[a-zA-Z0-9-_.]+)');
  let resArray = re.exec(url);
  return resArray ? resArray[1] : '';
};

/**
 * Recursively walk comment tree to get comment count
 */
export const getCommentCount = (comments: Comment[]) => {
  let commentCount = 0;
  comments = comments.filter(comment => comment.text);

  if (comments.length > 0) {
    commentCount += comments.length;
    for (const comment of comments) {
      commentCount += getCommentCount(comment.children);
    }
  }

  return commentCount;
};

/**
 * Determine if a story is 'hot' by number of points in a time period
 * 20 points per hour can be considered 'hot'
 */
export const getIsHot = (story: Story) => {
  const storyAgeHours = moment().diff(moment(story.created_at), 'hours');
  let hotnessRatio = story.points / storyAgeHours;
  return hotnessRatio >= 20;
};

// export const getStoryPath = (location) => {
//   const currentPath = location.pathname.split('/');
//   const subPath = currentPath[currentPath.length - 1];
//   const storyPaths = ['top', 'best', 'new'];
//   if (storyPaths.indexOf(subPath) !== -1) return subPath;
//   else return '';
// }
