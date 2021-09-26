import importScript from "./import-script";
import LiveApp from "./live";

await importScript("https://www.geogebra.org/apps/deployggb.js");

const params: GGBAppletParams = {
  appName: "classic",
  showMenuBar: true,
  showAlgebraInput: true,
  showToolBar: true,
  customToolBar:
    "0 39 73 62 | 1 501 67 , 5 19 , 72 75 76 | 2 15 45 , 18 65 , 7 37 | 4 3 8 9 , 13 44 , 58 , 47 | 16 51 64 , 70 | 10 34 53 11 , 24  20 22 , 21 23 | 55 56 57 , 12 | 36 46 , 38 49  50 , 71  14  68 | 30 29 54 32 31 33 | 25 17 26 60 52 61 | 40 41 42 , 27 28 35 , 6",
  showToolBarHelp: false,
  showResetIcon: false,
  enableFileFeatures: false,
  enableLabelDrags: false,
  enableShiftDragZoom: true,
  enableRightClick: true,
  errorDialogsActive: false,
  allowStyleBar: false,
  preventFocus: false,
  // showLogging: true,
  useBrowserForJS: true,
  language: "en",
  width: 800,
  height: 600,
  borderColor: "transparent",
};

const initialState = LiveApp.service.getItem("ggbBase64");
if (initialState) {
  params.ggbBase64 = initialState;
}

params.appletOnLoad = (app: GGBAppletObject) => {
  (window as any).app = app;
  console.log("loaded");

  const live = new LiveApp({ api: app, clientId: Math.random().toString(36).slice(2) });
  live.registerListeners();
  (window as any).live = live;

  LiveApp.service.addEventListener("message", e => {
    live.dispatch(e.data);
    app.setUndoPoint();
  });
};

let applet = new GGBApplet(params);

applet.inject(document.getElementById("app")!);

(window as any).applet = applet;
