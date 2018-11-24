import moment from 'moment';
import { Comment, Story } from '../store/AppState';

export const getAge = (created: string) => {
  //2018-11-22T20:06:28.000Z
  let createdOn = moment(created, 'YYYY-MM-DDTHH');
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
    comments.forEach(comment => {
      commentCount += getCommentCount(comment.children);
    });
  }

  return commentCount;
};

export const getHeatIndex = (story: Story) => {
  const storyAge = moment(story.created_at);
  let redAdjust = story.points / storyAge.minutes();
  let redness = redAdjust > 50 ? 50 : redAdjust;
  let heatIndex = 100 - redness;
  return { backgroundColor: `hsl(0, 50%, ${heatIndex}%` };
};

// export const getStoryPath = (location) => {
//   const currentPath = location.pathname.split('/');
//   const subPath = currentPath[currentPath.length - 1];
//   const storyPaths = ['top', 'best', 'new'];
//   if (storyPaths.indexOf(subPath) !== -1) return subPath;
//   else return '';
// }
