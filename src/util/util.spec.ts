import { Comment, Story } from '../store/AppState';
import { getAge, getCommentCount, getIsHot, parseDomain } from './util';

const comment: Comment = {
  id: 2,
  author: 'person',
  created_at: '2018-11-22T20:06:28.000Z',
  points: 100,
  text: 'This is a <b>comment</b>.',
  children: []
};

const story: Story = {
  id: 1,
  created_at: '2018-11-23T09:06:28.000Z',
  points: 400,
  author: 'person',
  title: 'Story title',
  url: 'http://www.google.com/',
  children: [
    {
      ...comment,
      children: [{ ...comment }, { ...comment, children: [{ ...comment }] }]
    },
    {
      ...comment,
      children: [{ ...comment }]
    }
  ]
};

const stories: Story[] = [
  { ...story },
  { ...story, id: 3, points: 400, created_at: '2018-11-22T16:06:28.000Z' },
  { ...story, id: 4, points: 100, created_at: '2018-11-22T20:06:28.000Z' },
  { ...story, id: 5, points: 20, created_at: '2018-11-22T23:06:28.000Z' },
  { ...story, id: 6, points: 90, created_at: '2018-11-22T23:06:28.000Z' }
];

let mockDateTimeNow: jest.Mock<() => number>;

describe('Utilities', () => {
  beforeAll(() => {
    mockDateTimeNow = jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(Date.UTC(2018, 10, 23, 12, 10, 30, 40));
    });
  });

  afterAll(() => {
    mockDateTimeNow.mockRestore();
  });

  it('#getAge should return age from date-time string', () => {
    const sameDay = '2018-11-22T20:06:28.000Z';
    expect(getAge(sameDay)).toEqual('16 hours ago');
  });

  it('#parseDomain should return the base url domain of a url', () => {
    const url = 'http://www.google.com/testing';
    expect(parseDomain(url)).toEqual('www.google.com');
  });

  it('#getHeadIndex should return an hsl background color style based on popularity and novelty', () => {
    expect(getIsHot(stories[0])).toEqual(true);
    expect(getIsHot(stories[1])).toEqual(true);
    expect(getIsHot(stories[2])).toEqual(false);
  });

  it('#getCommentCount should recursively count all comments in a comment tree', () => {
    expect(getCommentCount(story.children)).toEqual(6);
  });
});
