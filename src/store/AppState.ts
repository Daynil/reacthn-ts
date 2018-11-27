import axios from 'axios';
import { action, computed, observable, runInAction } from 'mobx';
import { history } from '../App';

export class AppState {
  hnBaseApi = 'https://hacker-news.firebaseio.com/v0';
  algoliaHnBaseApi = 'http://hn.algolia.com/api/v1';

  @observable
  isLoading = false;

  @observable
  stories: Story[] = [];

  @observable
  selectedStoryId = 0;

  @computed
  get selectedStory() {
    return this.stories.find(story => story.base.id === this.selectedStoryId);
  }

  @action
  selectStory(storyId: string) {
    const id = parseInt(storyId);
    if (isNaN(id)) history.push('/notfound');
    const story = this.stories.find(story => story.base.id === id);
    if (!story) history.push('/notfound');
    else this.selectedStoryId = id;
  }

  @action
  setLoading(loading: boolean) {
    if (this.isLoading === loading) return;
    this.isLoading = loading;
  }

  @action
  async getStories(useCache = false) {
    this.isLoading = true;
    if (useCache) {
      console.log('Using cached results');
      const storiesCache = require('./StoriesCache.json');
      setTimeout(() => {
        runInAction(() => {
          this.isLoading = false;
          this.stories = storiesCache.map((story: RawStory) => {
            return new Story(story);
          });
        });
      }, 1000);
    } else {
      const topIdsRes = await axios.get<number[]>(
        `${this.hnBaseApi}/topstories.json`
      );
      const topIds = topIdsRes.data.slice(0, 19);
      const stories = await Promise.all(
        topIds.map(async topId => {
          const storyRes = await axios.get<RawStory>(
            `${this.algoliaHnBaseApi}/items/${topId}`
          );
          return storyRes.data;
        })
      );
      runInAction(() => {
        this.isLoading = false;
        this.stories = stories.map(story => {
          return new Story(story);
        });
      });
    }
  }
}

/**
 * Pluck comments recursively in order to add observable minimized field
 */
export class Story {
  base: BaseStory;
  children: Comment[] = [];

  constructor(rawStory: RawStory) {
    const { children, ...baseStory } = rawStory;
    this.base = baseStory;
    for (const nestedComment of children) {
      this.children.push(new Comment(nestedComment));
    }
  }
}

export class Comment {
  base: BaseComment;
  @observable minimized = false;
  children: Comment[] = [];

  constructor(rawComment: RawComment) {
    const { children, ...baseComment } = rawComment;
    this.base = baseComment;
    for (const nestedComment of children) {
      this.children.push(new Comment(nestedComment));
    }
  }

  @action
  toggleMinimized() {
    this.minimized = !this.minimized;
  }
}

interface RawComment extends BaseComment {
  children: RawComment[];
}

interface BaseComment {
  id: number;
  created_at: string;
  author: string;
  text: string;
  points: number;
}

interface RawStory extends BaseStory {
  children: RawComment[];
}

interface BaseStory {
  id: number;
  created_at: string;
  author: string;
  title: string;
  url: string;
  points: number;
}

export interface User {
  username: string;
  about: string;
  karma: number;
}

export const appState = new AppState();
