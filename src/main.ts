import { createSSRApp } from "vue";
import App from "./App.vue";
import * as Pinia from "pinia";

const DEFAULT_SHARE_TITLE = "万里顺行";
const DEFAULT_SHARE_PATH = "/pages/launch/launch";
const APP_MESSAGE_SHARE_IMAGE = "/static/share_app_message.png";
const TIMELINE_SHARE_IMAGE = "/static/logo.png";

export function createApp() {
  const app = createSSRApp(App);
  app.use(Pinia.createPinia());
  app.mixin({
    onShareAppMessage() {
      return {
        title: DEFAULT_SHARE_TITLE,
        path: DEFAULT_SHARE_PATH,
        imageUrl: APP_MESSAGE_SHARE_IMAGE,
      };
    },
    onShareTimeline() {
      return {
        title: DEFAULT_SHARE_TITLE,
        query: `path=${encodeURIComponent(DEFAULT_SHARE_PATH)}`,
        imageUrl: TIMELINE_SHARE_IMAGE,
      };
    },
  });
  return {
    app,
  };
}
