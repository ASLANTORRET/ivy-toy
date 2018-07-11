App.info({
  id: 'com.alternate.na.mimimishki',
  name: 'mimimishki',
  description: 'Mimimishki shop for children',
  author: 'Mimimishki.kz',
  email: 'na@alternate.kz',
  website: 'http://mimimishki.kz',
  version: "0.0.10"
});
// Set up resources such as icons and launch screens.
App.icons({
  // iphone: 'public/icons/60x60.png',
  iphone_2x: 'public/icons/120x120.png',
  iphone_3x: 'public/icons/180x180.png',
  ipad: 'public/icons/76x76.png',
  ipad_2x: 'public/icons/152x152.png',
  ipad_pro: 'public/icons/167x167.png',
  ios_settings: 'public/icons/29x29.png',
  ios_settings_2x: 'public/icons/58x58.png',
  ios_settings_3x: 'public/icons/87x87.png',
  ios_spotlight: 'public/icons/40x40.png',
  ios_spotlight_2x: 'public/icons/80x80.png',
  android_mdpi: 'public/icons/48x48.png',
  android_hdpi: 'public/icons/72x72.png',
  android_xhdpi: 'public/icons/96x96.png',
  android_xxhdpi: 'public/icons/144x144.png',
  android_xxxhdpi: 'public/icons/192x192.png',
});
App.launchScreens({
  // iphone: 'public/splash/320x480.png',
  iphone_2x: 'public/splash/640x960.png',
  iphone5: 'public/splash/640x1136.png',
  iphone6: 'public/splash/750x1334.png',
  iphone6p_portrait: 'public/splash/1242x2208.png',
  // iphone6p_landscape: 'public/splash/2208x1242.png',
  // ipad_portrait: 'public/splash/768x1024.png',
  // ipad_portrait_2x: 'public/splash/1536x2048.png',
  // ipad_landscape: 'public/splash/1024x768.png',
  // ipad_landscape_2x: 'public/splash/2048x1536.png',
  android_mdpi_portrait: 'public/splash/320x470.png',
  // android_mdpi_landscape: 'public/splash/470x320.png',
  android_hdpi_portrait: 'public/splash/480x640.png',
  // android_hdpi_landscape: 'public/splash/640x480.png',
  android_xhdpi_portrait: 'public/splash/720x960.png',
  // android_xhdpi_landscape: 'public/splash/960x720.png',
  android_xxhdpi_portrait: 'public/splash/1080x1440.png',
  // android_xxhdpi_landscape: 'public/splash/1440x1080.png',
});
App.accessRule('http://*');
App.accessRule('https://*');
