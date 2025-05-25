import 'dotenv/config';

export default {
  expo: {
    name: "WatchMe",
    slug: "WatchMe",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon1.jpg",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    web: {
      bundler: "metro",
      output: "single",
      favicon: "./assets/images/icon1.jpg"
    },
    plugins: ["expo-router"],
    experiments: {
      typedRoutes: true
    },
    extra: {
      ENCRYPTION_KEY: process.env.ENCRYPTION_KEY
    }
  }
};
