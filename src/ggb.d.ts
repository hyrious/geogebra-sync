/**
 * As a special exception, if you include this header file into source
 * files compiled by GCC, this header file does not by itself cause
 * the resulting executable to be covered by the GNU General Public
 * License.  This exception does not however invalidate any other
 * reasons why the executable file might be covered by the GNU General
 * Public License.
 */

/**
 * This file has no copyright assigned and is placed in the Public Domain.
 */

// this file has no `import` or `export`, which means all declarations are
// executed in **global scope**, so that we can reference types in any other file.

// this file is not complete, feel free to add/change these types

/**
 * @link https://wiki.geogebra.org/en/Reference:GeoGebra_App_Parameters
 */
declare interface GGBAppletParams {
  /** @default "classic" */
  appName?: "graphing" | "geometry" | "3d" | "classic" | "suite" | "evaluator" | "scientific";
  width?: number;
  height?: number;
  material_id?: string;
  filename?: string;
  ggbBase64?: string;
  borderColor?: string;
  /** @default true */
  enableRightClick?: boolean;
  /** @default true */
  enableLabelDrags?: boolean;
  /** @default true */
  enableShiftDragZoom?: boolean;
  /** @default false */
  showZoomButtons?: boolean;
  /** @default true */
  errorDialogsActive?: boolean;
  /** @default false */
  showMenuBar?: boolean;
  /** @default false */
  showToolBar?: boolean;
  /** @default true */
  showToolBarHelp?: boolean;
  /**
   * @link https://wiki.geogebra.org/en/Reference:Toolbar
   * @example "0 1 2 3 , 4 5 6 7"
   */
  customToolBar?: string;
  /** @default false */
  showAlgebraInput?: boolean;
  /** @default false */
  showResetIcon?: boolean;
  /** @link https://www.wikiwand.com/en/List_of_ISO_639-1_codes */
  language?: string;
  /** @example "AT" // Austria */
  country?: string;
  /**
   * @see {@link GGBAppletObject.ggbOnInit}
   * @example "applet2"
   */
  id?: string;
  /** @default false */
  allowStyleBar?: boolean;
  randomSeed?: number;
  appletOnLoad?: (api: any) => void;
  /** @default false */
  useBrowserForJS?: boolean;
  /** @default false */
  showLogging?: boolean;
  /** @default 3 */
  capturingThreshold?: number;
  /** @default true */
  enableFileFeatures?: boolean;
  /** @default true */
  enableUndoRedo?: boolean;
  /** @link https://wiki.geogebra.org/en/SetPerspective_Command */
  perspective?: string;
  enable3d?: boolean | undefined;
  enableCAS?: boolean | undefined;
  algebraInputPosition?: "algebra" | "top" | "bottom";
  /** @default false */
  preventFocus?: boolean;
  scaleContainerClass?: string;
  autoHeight?: boolean;
  /** @default false */
  allowUpscale?: boolean;
  /** @default false */
  playButton?: boolean;
  /** @default 1 */
  scale?: number;
  showAnimationButton?: boolean;
  showFullscreenButton?: boolean;
  showSuggestionButtons?: boolean;
  showStartTooltip?: boolean;
  /**
   * `s` = significant, `r` = rational
   */
  rounding?: `${number}${"" | "s" | "r"}`;
  buttonShadows?: boolean;
  /**
   * 0 - 0.9
   * @default 0.2
   */
  buttonRounding?: number;
  /** @default "#000" */
  buttonBorderColor?: string;
  editorBackgroundColor?: string;
  /** text color, app name = `evaluator` */
  editorForegroundColor?: string;
  /**
   * app name = `evaluator`
   * @default false
   */
  textmode?: boolean;
  /** app name = `evaluator` */
  keyboardType?: "scientific" | "normal" | "notes";
}

/**
 * Simple & stupid type declarations, very naive.
 * @link https://wiki.geogebra.org/en/Reference:GeoGebra_Apps_API
 */
declare class GGBApplet {
  constructor(params?: GGBAppletParams, html5NoWebSimple?: boolean): void;
  inject(id_or_element: string | HTMLElement): void;
  getAppletObject(): GGBAppletObject;
}

/**
 * @link https://wiki.geogebra.org/en/Reference:GeoGebra_Apps_API
 *
 * Functions below is generated from the link above.
 * Further types should come from
 * https://github.com/geogebra/geogebra/blob/master/web/src/main/java/org/geogebra/web/html5/main/DefaultExportedApi.java
 */
declare class GGBAppletObject {
  evalCommand(cmdString: string): boolean;
  evalCommandGetLabels(cmdString: string): string[];
  evalCommandCAS(string: string): string;
  setUndoPoint(): void;
  deleteObject(objName: string): void;
  setAuxiliary(geo: any, boolean): void;
  setValue(objName: string, value: number): void;
  setTextValue(objName: string, value: string): void;
  setListValue(objName: string, i: number, value: number): void;
  setCoords(objName: string, x: number, y: number, z?: number): void;
  setCaption(objName: string, caption: string): void;
  setColor(objName: string, red: number, green: number, blue: number): void;
  setVisible(objName: string, visible: boolean): void;
  setLabelVisible(objName: string, visible: boolean): void;
  setLabelStyle(objName: string, style: number): void;
  setFixed(objName: string, fixed: boolean, selectionAllowed: boolean): void;
  setTrace(objName: string, flag: boolean): void;
  renameObject(oldObjName: string, newObjName: string): boolean;
  setLayer(objName: string, layer: number): void;
  setLayerVisible(layer: number, visible: boolean): void;
  setLineStyle(objName: string, style: number): void;
  setLineThickness(objName: string, thickness: number): void;
  setPointStyle(objName: string, style: number): void;
  setPointSize(objName: string, size: number): void;
  setDisplayStyle(objName: string, style: string): void;
  setFilling(objName: string, filling: number): void;
  getPNGBase64(exportScale: number, transparent: boolean, DPI: number): string;
  exportSVG(filename: string): void;
  exportSVG(callback: (svg: string) => void): void;
  exportPDF(scale: number, filename: string, sliderLabel: string): void;
  exportPDF(scale: number, callback: _function_, sliderLabel: string): void;
  getScreenshotBase64(callback: _function_): void;
  writePNGtoFile(filename: string, exportScale: number, transparent: boolean, DPI: number): boolean;
  isIndependent(objName: string): boolean;
  isMoveable(objName: string): boolean;
  setAnimating(objName: string, animate: boolean): void;
  setAnimationSpeed(objName: string, speed: number): void;
  startAnimation(): void;
  stopAnimation(): void;
  isAnimationRunning(): boolean;
  getXcoord(objName: string): number;
  getYcoord(objName: string): number;
  getZcoord(objName: string): number;
  getValue(objName: string): number;
  getListValue(objName: string, index: number): number;
  getColor(objName: string): string;
  getVisible(objName: string, view?: number): boolean;
  getValueString(objName: string, useLocalizedInput?: boolean): string;
  getDefinitionString(objName: string): string;
  getCommandString(objName: string, useLocalizedInput?: boolean): string;
  getLaTeXString(objName: string): string;
  getLaTeXBase64(objName: string, value: boolean): string;
  getObjectType(objName: string): string;
  exists(objName: string): boolean;
  isDefined(objName: string): boolean;
  getAllObjectNames(type?: string): string[];
  getObjectNumber(): number;
  getCASObjectNumber(): number;
  getObjectName(i: number): string;
  getLayer(objName: string): string;
  getLineStyle(objName: string): number;
  getLineThickness(objName: string): number;
  getPointStyle(objName: string): number;
  getPointSize(objName: string): number;
  getFilling(objName: string): number;
  getCaption(objectName: string, substitutePlaceholders: boolean): void;
  getLabelStyle(objectName: string): void;
  getLabelVisible(): void;
  setMode(mode: number): void;
  getMode(): number;
  openFile(strURL: string): void;
  reset(): void;
  newConstruction(): void;
  refreshViews(): void;
  setOnTheFlyPointCreationActive(flag: boolean): void;
  setPointCapture(view: any, mode: any): void;
  setRounding(round: string): void;
  hideCursorWhenDragging(flag: boolean): void;
  setRepaintingActive(flag: boolean): void;
  setErrorDialogsActive(flag: boolean): void;
  setCoordSystem(xmin: number, xmax: number, ymin: number, ymax: number): void;
  setCoordSystem(
    xmin: number,
    xmax: number,
    ymin: number,
    ymax: number,
    zmin: number,
    zmax: number,
    yVertical: boolean
  ): void;
  setAxesVisible(xAxis: boolean, yAxis: boolean): void;
  setAxesVisible(viewNumber: number, xAxis: boolean, yAxis: boolean, zAxis: boolean): void;
  setAxisLabels(viewNumber: number, xAxis: string, yAxis: string, zAxis: string): void;
  setAxisSteps(viewNumber: number, xAxis: number, yAxis: number, zAxis: number): void;
  setAxisUnits(viewNumber: number, xAxis: string, yAxis: string, zAxis: string): void;
  setGridVisible(flag: boolean): void;
  setGridVisible(viewNumber: number, flag: boolean): void;
  getGridVisible(viewNumber: number): void;
  getPerspectiveXML(): void;
  undo(): void;
  redo(): void;
  showToolBar(show: boolean): void;
  setCustomToolBar(toolbar: string): void;
  showMenuBar(show: boolean): void;
  showAlgebraInput(show: boolean): void;
  showResetIcon(show: boolean): void;
  enableRightClick(enable: boolean): void;
  enableLabelDrags(enable: boolean): void;
  enableShiftDragZoom(enable: boolean): void;
  enableCAS(enable: boolean): void;
  enable3D(enable: boolean): void;
  setPerspective(perspective: string): void;
  setWidth(width: number): void;
  setHeight(height: number): void;
  setSize(width: number, height: number): void;
  recalculateEnvironments(): void;
  addImage(fileName: string, fileContent: string): void;
  handleSlideAction(type: string, action: string, objName?: string): void;
  selectSlide(slide: string): void;
  getEditorState(): any;
  setEditorState(state: any, objName?: string): void;
  getObjectsOfItsGroup(objName: string): string[] | null;
  getEmbeddedCalculators(includeGraspableMath?: boolean): Record<string, EmbeddedCalculator> | null;
  updateConstruction(): void;
  hasUnlabeledPredecessors(objName: string): boolean;
  getImageFileName(objName?: string): string;
  registerAddListener(JSFunctionName: string | ((objName: string) => void)): void;
  unregisterAddListener(JSFunctionName: string | ((objName: string) => void)): void;
  registerRemoveListener(JSFunctionName: string | ((objName: string) => void)): void;
  unregisterRemoveListener(JSFunctionName: string | ((objName: string) => void)): void;
  registerUpdateListener(JSFunctionName: string | ((objName: string) => void)): void;
  unregisterUpdateListener(JSFunctionName: string | ((objName: string) => void)): void;
  registerClickListener(JSFunctionName: string | ((objName: string) => void)): void;
  unregisterClickListener(JSFunctionName: string | ((objName: string) => void)): void;
  registerObjectUpdateListener(
    objName: string,
    JSFunctionName: string | ((objName: string) => void)
  ): void;
  unregisterObjectUpdateListener(objName: string): void;
  registerObjectClickListener(
    objName: string,
    JSFunctionName: string | ((objName: string) => void)
  ): void;
  unregisterObjectClickListener(objName: string): void;
  registerRenameListener(
    JSFunctionName: string | ((oldName: string, newName: string) => void)
  ): void;
  unregisterRenameListener(objName: string | ((oldName: string, newName: string) => void)): void;
  registerClearListener(JSFunctionName: string | ((objName: string) => void)): void;
  unregisterClearListener(JSFunctionName: string | ((objName: string) => void)): void;
  registerStoreUndoListener(JSFunctionName: string | ((objName: string) => void)): void;
  unregisterStoreUndoListener(JSFunctionName: string | ((objName: string) => void)): void;
  /** @link https://wiki.geogebra.org/en/Reference:GeoGebra_Apps_API#Client_Events */
  registerClientListener(JSFunctionName: string | ((event: any) => void)): void;
  unregisterClientListener(JSFunctionName: string | ((event: any) => void)): void;
  evalXML(xmlString: string): void;
  setXML(xmlString: string): void;
  getXML(objName?: string): string;
  getAlgorithmXML(objName: string): string;
  getFileJSON(): { archive: { fileName: string; fileContent: string }[] };
  setFileJSON(content?: { archive: { fileName: string; fileContent: string }[] }): string;
  getBase64(callback?: (base64: string) => void): string;
  setBase64(base64: string, onLoad: () => void): void;
  previewRefresh(): void;
  debug(string: string): void;
  getVersion(): string;
  addMultiuserSelection(name: string, color: string, label: string, justAdded?: boolean): void;
  removeMultiuserSelections(name: string): void;
  updateOrdering(labels: string): void;
  groupObjects(objects: string): void;
  ungroupObjects(objects: string): void;
  addToGroup(groupName: string, objects: string): void;
  setEmbedContent(label: string, base64: string): void;
  addGeoToTV(objName: string): void;
  setValuesOfTV(values: string): void;
  removeGeoFromTV(label: string): void;
  showPointsTV(column: string, show: string): void;
  lockTextElement(objName: string): void;
  unlockTextElement(objName: string): void;
}

interface EmbeddedCalculator extends GGBAppletObject {
  controller?: any;
  toJSON(): string;
  loadFromJSON(json: string): void;
}
