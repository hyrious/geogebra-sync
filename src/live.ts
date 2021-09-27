// based on https://github.com/geogebra/geogebra/blob/master/web/src/main/resources/org/geogebra/web/resources/war/geogebra-live.js

import SameOriginSyncService from "./service";

export interface LiveAppOptions {
  /** used for conflict resolution, make sure it is unique */
  clientId: string;
  /** used for conflict resolution */
  getUsers?: () => string[];

  api: GGBAppletObject;
  /** throttle timeout */
  delay?: number;
  /** is run in embed env */
  embedLabel?: string;
}

type LiveAppEventType =
  | "evalGMContent"
  | "evalCommand"
  | "addToGroup"
  | "evalXML"
  | "setXML"
  | "select"
  | "deselect"
  | "addImage"
  | "addSlide"
  | "addObject"
  | "deleteObject"
  | "renameObject"
  | "setEditorState"
  | "removeSlide"
  | "moveSlide"
  | "selectSlide"
  | "clearSlide"
  | "pasteSlide"
  | "orderingChange"
  | "embeddedContentChanged"
  | "startAnimation"
  | "stopAnimation"
  | "groupObjects"
  | "ungroupObjects"
  | "addGeoToTV"
  | "removeGeoFromTV"
  | "setValuesOfTV"
  | "showPointsTV"
  | "lockTextElement"
  | "unlockTextElement"
  | "conflictResolution";

export interface LiveAppEvent {
  type: LiveAppEventType;
  content?: string;
  label?: string;
  embedLabel?: string;
  clientId: string;
}

/**
 * @example
 * const clientId = Math.random().toString(36).slice(2)
 * const api = ggbApplet.getAppletObject()
 * const getUsers = () => []
 * let app = new LiveApp({ clientId, api, getUsers })
 * app.registerListeners()
 */
export default class LiveApp {
  static readonly service = SameOriginSyncService;

  readonly clientId: string;
  readonly api: GGBAppletObject;
  readonly embedLabel?: string;
  readonly getUsers?: () => string[];

  delay: number;
  /** labels that is in animation, don't sync them */
  currentAnimations: string[] = [];
  embeds: Record<string, LiveApp> = {};

  constructor(options: LiveAppOptions) {
    this.clientId = options.clientId;
    this.api = options.api;
    this.embedLabel = options.embedLabel;
    this.getUsers = options.getUsers;
    this.delay = options.delay ?? 200;
  }

  createEvent(type: LiveAppEventType, content?: string, label?: string): LiveAppEvent {
    const event: LiveAppEvent = { type, content, clientId: this.clientId };
    if (this.embedLabel) event.embedLabel = this.embedLabel;
    if (label) event.label = label;
    return event;
  }

  private storageCallback = 0;

  sendEvent(type: LiveAppEventType, content?: string, label?: string) {
    console.log("send:", type, label, content);
    LiveApp.service.postMessage(this.createEvent(type, content, label));

    if (!this.storageCallback) {
      this.storageCallback = setTimeout(() => {
        LiveApp.service.setItem("ggbBase64", this.api.getBase64());
        this.storageCallback = 0;
      }, this.delay);
    }
  }

  evalCommand(command: string) {
    this.unregisterListeners();
    this.api.evalCommand(command);
    this.registerListeners();
  }

  evalXML(xml: string) {
    this.unregisterListeners();
    this.api.evalXML(xml);
    this.api.updateConstruction();
    this.registerListeners();
    setTimeout(this.initAllEmbeds, 500);
  }

  setXML(xml: string) {
    this.unregisterListeners();
    this.api.setXML(xml);
    this.api.updateConstruction();
    this.registerListeners();
  }

  initEmbed(label: string) {
    if (this.embeds[label]) return;
    const calc = (this.api.getEmbeddedCalculators() || {})[label];
    if (calc && "registerClientListener" in calc) {
      const child = new LiveApp({
        clientId: this.clientId,
        getUsers: this.getUsers,
        api: calc,
        embedLabel: label,
      });
      child.registerListeners();
      this.embeds[label] = child;
    }
  }

  initAllEmbeds = () => {
    for (const label of this.api.getAllObjectNames("embed")) {
      this.initEmbed(label);
    }
  };

  private objectsInWaiting: string[] = [];
  private updateCallback = 0;

  dispatchUpdates = () => {
    if (!this.updateCallback) {
      this.updateCallback = setTimeout(this._dispatchUpdates, this.delay);
    }
  };

  private _dispatchUpdates = () => {
    const tempObjects = this.objectsInWaiting;
    this.objectsInWaiting = [];

    for (const label of tempObjects) {
      const calculators = this.api.getEmbeddedCalculators(true);
      const embed = calculators?.[label];

      if (embed?.controller) {
        this.sendEvent("evalGMContent", embed.toJSON(), label);
      }

      let command = this.api.getCommandString(label, false);
      if (command) {
        this.sendEvent("evalCommand", `${label} := ${command}`, label);
        const group = this.api.getObjectsOfItsGroup(label);
        if (group?.length) {
          this.sendEvent("addToGroup", label, group as unknown as string);
        }
      }

      if (!command || this.api.isMoveable(label)) {
        let xml = this.api.getXML(label);
        this.sendEvent("evalXML", xml, label);
      }

      this.sendEvent("select", label, "true");
    }

    this.updateCallback = 0;
  };

  updateListener = (label: string) => {
    if (
      (this.api.hasUnlabeledPredecessors(label) || this.api.isMoveable(label)) &&
      !this.currentAnimations.includes(label)
    ) {
      if (!this.objectsInWaiting.includes(label)) {
        this.objectsInWaiting.push(label);
        this.dispatchUpdates();
      }
    }
  };

  addListener = (label: string) => {
    const image = this.api.getImageFileName(label);
    if (image) {
      const json = this.api.getFileJSON();
      for (const item of json.archive) {
        if (item.fileName.includes(image)) {
          this.sendEvent("addImage", JSON.stringify(item));
        }
      }
    }

    const xml = this.api.getXML(label);
    const definition = this.api.getCommandString(label);
    const algorithmXML = definition && this.api.getAlgorithmXML(label);
    this.sendEvent("addObject", algorithmXML || xml, label);

    this.sendEvent("deselect");
    this.sendEvent("select", label, "true");
    setTimeout(() => this.initEmbed(label), 500);
  };

  removeListener = (label: string) => {
    this.sendEvent("deleteObject", label);
    delete this.embeds[label];
  };

  renameListener = (oldName: string, newName: string) => {
    this.sendEvent("renameObject", oldName, newName);
  };

  private lastEditingLabel = "";

  clientListener = (event: string[] & Record<string, string>) => {
    let label: string, xml: string, state: any;

    switch (event[0]) {
      case "updateStyle":
        label = event[1];
        xml = this.api.getXML(label);
        this.sendEvent("evalXML", xml);
        break;

      case "editorStart":
        this.lastEditingLabel = event[1];
        break;

      case "editorKeyTyped":
        state = this.api.getEditorState();
        this.sendEvent("setEditorState", state, event[1] || this.lastEditingLabel);
        break;

      case "editorStop":
        this.lastEditingLabel = "";
        this.sendEvent("setEditorState", '{"content":""}');
        break;

      case "deselect":
        this.sendEvent(event[0]);
        break;

      case "select":
        this.sendEvent(event[0], event[1], event[2]);
        break;

      case "embeddedContentChanged":
        this.sendEvent(event[0], event[2], event[1]);
        break;

      case "undo":
      case "redo":
      case "addPolygonComplete":
        xml = this.api.getXML();
        this.sendEvent("setXML", xml);
        break;

      case "addSlide":
        this.sendEvent(event[0]);
        break;

      case "removeSlide":
      case "moveSlide":
      case "selectSlide":
      case "clearSlide":
      case "orderingChange":
        this.sendEvent(event[0], event[2]);
        break;

      case "pasteSlide":
        this.sendEvent(event[0], event.cardIdx, event.ggbFile);
        break;

      case "startAnimation":
        label = event[1];
        this.currentAnimations.push(label);
        this.sendEvent(event[0], label, label);
        break;

      case "stopAnimation":
        label = event[1];
        this.currentAnimations.splice(this.currentAnimations.indexOf(label), 1);
        this.sendEvent(event[0], label, label);
        break;

      case "groupObjects":
      case "ungroupObjects":
        this.sendEvent(event[0], event.targets);
        break;

      case "pasteElmsComplete":
        let pastedGeos = "";
        for (const geo of event.targets) {
          pastedGeos += this.api.getXML(geo);
        }
        this.sendEvent("evalXML", pastedGeos);
        break;

      case "addGeoToTV":
      case "removeGeoFromTV":
        this.sendEvent(event[0], event[1]);
        break;

      case "setValuesOfTV":
        this.sendEvent(event[0], event[2]);
        break;

      case "showPointsTV":
        this.sendEvent(event[0], event.column, event.show);
        break;

      case "lockTextElement":
      case "unlockTextElement":
        this.sendEvent(event[0], event[1]);
        break;

      case "mouseDown":
      case "deleteGeos":
        // ignore
        break;

      default:
        console.debug("unhandled event ", event[0], event);
    }
  };

  registerListeners() {
    this.api.registerUpdateListener(this.updateListener);
    this.api.registerRemoveListener(this.removeListener);
    this.api.registerAddListener(this.addListener);
    this.api.registerClientListener(this.clientListener);
    this.api.registerRenameListener(this.renameListener);
  }

  unregisterListeners() {
    this.api.unregisterUpdateListener(this.updateListener);
    this.api.unregisterRemoveListener(this.removeListener);
    this.api.unregisterAddListener(this.addListener);
    this.api.unregisterClientListener(this.clientListener);
    this.api.unregisterRenameListener(this.renameListener);
  }

  private conflictedObjects: string[] = [];

  dispatch = (last: LiveAppEvent) => {
    if (
      this.conflictedObjects.includes(last.label as string) &&
      "conflictResolution" !== (last.type as string)
    ) {
      return;
    }

    const target = last.embedLabel ? this.embeds[last.embedLabel] : this;
    const type = last.type;
    const label = last.label as string;
    const content = last.content as string;
    const users = this.getUsers?.();

    console.debug("receive:", type, label, content);

    if (type === "addObject") {
      if (target.api.exists(label)) {
        if (users?.includes(this.clientId)) {
          // conflict resolution
          if (this.clientId === String(Math.min(...users.map(e => Number(e))))) {
            let counter = 1;
            let newLabel: string;
            do {
              newLabel = `${label}_${counter}`;
              counter++;
            } while (target.api.exists(newLabel));

            this.unregisterListeners();
            target.api.renameObject(label, newLabel);
            this.registerListeners();
            this.sendEvent("conflictResolution", target.api.getAlgorithmXML(newLabel), label);
          } else {
            this.conflictedObjects.push(label);
          }
        } else {
          target.evalXML(content);
          target.api.previewRefresh();
        }
      } else {
        target.evalXML(content);
        target.api.previewRefresh();
      }
    } else if (type === "conflictResolution") {
      const i = this.conflictedObjects.indexOf(label);
      if (i !== -1) this.conflictedObjects.splice(i, 1);
      target.evalXML(content);
      target.api.previewRefresh();
    } else if (type === "evalXML") {
      target.evalXML(content);
      target.api.previewRefresh();
    } else if (type === "setXML") {
      target.setXML(content);
    } else if (type === "evalCommand") {
      target.evalCommand(content);
      target.api.previewRefresh();
    } else if (type === "deleteObject") {
      target.unregisterListeners();
      if (target === this) delete this.embeds[content];
      target.api.deleteObject(content);
      target.registerListeners();
    } else if (type === "setEditorState") {
      target.unregisterListeners();
      target.api.setEditorState(content, label);
      target.registerListeners();
    } else if (type === "addImage") {
      const file = JSON.parse(content);
      target.api.addImage(file.fileName, file.fileContent);
    } else if (["addSlide", "removeSlide", "moveSlide", "clearSlide"].includes(type)) {
      target.api.handleSlideAction(type, content);
    } else if (type === "selectSlide") {
      target.unregisterListeners();
      target.api.selectSlide(content);
      target.registerListeners();
    } else if (type === "renameObject") {
      target.unregisterListeners();
      target.api.renameObject(content, label);
      target.registerListeners();
    } else if (type === "pasteSlide") {
      target.api.handleSlideAction(type, content, label);
    } else if (type === "evalGMContent") {
      const gmApi = (target.api.getEmbeddedCalculators(true) || {})[label];
      if (gmApi) gmApi.loadFromJSON(content);
    } else if (type === "startAnimation") {
      target.api.setAnimating(label, true);
      target.api.startAnimation();
    } else if (type === "stopAnimation") {
      target.api.setAnimating(label, false);
    } else if (type === "select") {
      let user = this.getUsers?.().includes(last.clientId);
      if (user && content) {
        target.api.addMultiuserSelection(last.clientId, "#000000", content, !!label);
      }
    } else if (type === "deselect") {
      let user = this.getUsers?.().includes(last.clientId);
      if (user) {
        target.api.removeMultiuserSelections(last.clientId);
      }
    } else if (type === "orderingChange") {
      target.api.updateOrdering(content);
    } else if (type === "groupObjects") {
      target.api.groupObjects(content);
    } else if (type === "ungroupObjects") {
      target.api.ungroupObjects(content);
    } else if (type === "addToGroup") {
      target.api.addToGroup(content, label);
    } else if (type === "embeddedContentChanged") {
      target.api.setEmbedContent(label, content);
    } else if (type === "addGeoToTV") {
      target.api.addGeoToTV(content);
    } else if (type === "setValuesOfTV") {
      target.api.setValuesOfTV(content);
    } else if (type === "removeGeoFromTV") {
      target.api.removeGeoFromTV(content);
    } else if (type === "showPointsTV") {
      target.api.showPointsTV(content, label);
    } else if (type === "lockTextElement") {
      target.api.lockTextElement(content);
    } else if (type === "unlockTextElement") {
      target.api.unlockTextElement(content);
    } else {
      console.debug("unknown event", type, content, label);
    }
  };
}
