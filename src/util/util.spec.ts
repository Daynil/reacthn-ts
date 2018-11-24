import { Story } from '../store/AppState';
import { getAge, getHeatIndex, parseDomain } from './util';

describe('Utilities', () => {
  it('#getAge should return age from date-time string', () => {
    const dateTime = '2018-11-22T20:06:28.000Z';
    const age = getAge(dateTime);
    expect(age.slice(age.length - 3, age.length)).toEqual('ago');
  });

  it('#parseDomain should return the base url domain of a url', () => {
    const url = 'http://www.google.com/testing';
    expect(parseDomain(url)).toEqual('www.google.com');
  });

  it('#getHeadIndex should return an hsl background color style based on popularity and novelty', () => {
    const story: Story = {
      created_at: '2018-11-22T20:06:28.000Z',
      points: 500,
      author: '',
      children: [],
      id: 1,
      title: '',
      url: ''
    };
    expect(getHeatIndex(story)).toEqual({ backgroundColor: 'hsl(0, 50%, 50%' });
  });
});
