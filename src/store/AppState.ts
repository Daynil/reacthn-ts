import axios from 'axios';
import { action, observable, runInAction } from 'mobx';

class AppState {
  hnBaseApi = 'https://hacker-news.firebaseio.com/v0';
  algoliaHnBaseApi = 'http://hn.algolia.com/api/v1';

  @observable
  isLoading = false;

  @observable
  stories: Story[] = [];

  @action
  async getStories(useCache = false) {
    this.isLoading = true;
    if (useCache) {
      console.log('Using cached results');
      const storiesCache = require('./StoriesCache.json');
      setTimeout(() => {
        runInAction(() => {
          this.isLoading = false;
          this.stories = storiesCache;
        });
      }, 1000);
    } else {
      const topIdsRes = await axios.get<number[]>(
        `${this.hnBaseApi}/topstories.json`
      );
      const topIds = topIdsRes.data.slice(0, 19);
      const stories = await Promise.all(
        topIds.map(async topId => {
          const storyRes = await axios.get<Story>(
            `${this.algoliaHnBaseApi}/items/${topId}`
          );
          return storyRes.data;
        })
      );
      runInAction(() => {
        this.isLoading = false;
        this.stories = stories;
      });
    }
  }
}

export interface Story {
  id: number;
  created_at: string;
  author: string;
  title: string;
  url: string;
  points: number;
  children: Comment[];
}

export interface Comment {
  id: number;
  created_at: string;
  author: string;
  text: string;
  points: number;
  children: Comment[];
}

export interface User {
  username: string;
  about: string;
  karma: number;
}

export const appState = new AppState();
