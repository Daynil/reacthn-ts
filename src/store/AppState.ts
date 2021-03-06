import { createMuiTheme, PaletteType } from '@material-ui/core';
import { cyan, indigo } from '@material-ui/core/colors';
import axios from 'axios';
import { action, computed, observable, runInAction } from 'mobx';
import { history } from '../App';

export class AppState {
  hnBaseApi = 'https://hacker-news.firebaseio.com/v0';
  algoliaHnBaseApi = 'http://hn.algolia.com/api/v1';

  @observable
  isLoading = false;

  @observable
  loadedStoryIds: number[] | null = null;

  @observable
  stories: Story[] = [];

  @observable
  selectedStoryId = 0;

  @observable
  uiThemeType: PaletteType = 'light';

  uiThemes = {
    light: createMuiTheme({
      palette: {
        primary: indigo,
        secondary: cyan,
        type: 'light'
      }
    }),
    dark: createMuiTheme({
      palette: {
        primary: indigo,
        secondary: cyan,
        type: 'dark'
      }
    })
  };

  @computed
  get selectedStory() {
    return this.stories.find(story => story.base.id === this.selectedStoryId);
  }

  @computed
  get uiTheme() {
    return this.uiThemes[this.uiThemeType];
  }

  @action
  switchTheme(lightsOn: boolean) {
    if (lightsOn) this.uiThemeType = 'light';
    else this.uiThemeType = 'dark';
  }

  @action
  selectStory(storyId: string) {
    const id = parseInt(storyId);
    if (isNaN(id)) {
      history.push('/notfound');
      this.isLoading = false;
    }
    const story = this.stories.find(story => story.base.id === id);
    if (!story) {
      history.push('/notfound');
      this.isLoading = false;
    } else this.selectedStoryId = id;
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
          this.loadedStoryIds = this.stories.map(story => story.base.id);
        });
      }, 1000);
    } else {
      if (this.loadedStoryIds === null) {
        const topIdsRes = await axios.get<number[]>(
          `${this.hnBaseApi}/topstories.json`
        );
        this.loadedStoryIds = topIdsRes.data;
      } else if (!this.loadedStoryIds.length) return;
      const storyIdsToLoadNext = [...this.loadedStoryIds.splice(0, 20)];
      const rawStories = await Promise.all(
        storyIdsToLoadNext.map(async topId => {
          const storyRes = await axios.get<RawStory>(
            `${this.algoliaHnBaseApi}/items/${topId}`
          );
          return storyRes.data;
        })
      );
      const stories = rawStories.map(story => {
        return new Story(story);
      });
      runInAction(() => {
        this.isLoading = false;
        this.stories.push(...stories);
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
