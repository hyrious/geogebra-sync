var e=Object.defineProperty,t=(t,s,i)=>(((t,s,i)=>{s in t?e(t,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[s]=i})(t,"symbol"!=typeof s?s+"":s,i),i);!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const s of e)if("childList"===s.type)for(const e of s.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const s=new Map;const i=new BroadcastChannel("sync-service"),n={getItem(e){const t=localStorage.getItem(e);return t?JSON.parse(t):void 0},setItem(e,t){void 0===t?localStorage.removeItem(e):localStorage.setItem(e,JSON.stringify(t))},postMessage(e){i.postMessage(e)},addEventListener(e,t){i.addEventListener(e,t)}},a=class{constructor(e){var s;t(this,"clientId"),t(this,"api"),t(this,"embedLabel"),t(this,"getUsers"),t(this,"delay"),t(this,"currentAnimations",[]),t(this,"embeds",{}),t(this,"storageCallback",0),t(this,"initAllEmbeds",(()=>{for(const e of this.api.getAllObjectNames("embed"))this.initEmbed(e)})),t(this,"objectsInWaiting",[]),t(this,"updateCallback",0),t(this,"dispatchUpdates",(()=>{this.updateCallback||(this.updateCallback=setTimeout(this._dispatchUpdates,this.delay))})),t(this,"_dispatchUpdates",(()=>{const e=this.objectsInWaiting;this.objectsInWaiting=[];for(const t of e){const e=this.api.getEmbeddedCalculators(!0),s=null==e?void 0:e[t];(null==s?void 0:s.controller)&&this.sendEvent("evalGMContent",s.toJSON(),t);let i=this.api.getCommandString(t,!1);if(i){this.sendEvent("evalCommand",`${t} := ${i}`,t);const e=this.api.getObjectsOfItsGroup(t);(null==e?void 0:e.length)&&this.sendEvent("addToGroup",t,e)}if(!i||this.api.isMoveable(t)){let e=this.api.getXML(t);this.sendEvent("evalXML",e,t)}this.sendEvent("select",t,"true")}this.updateCallback=0})),t(this,"updateListener",(e=>{!this.api.hasUnlabeledPredecessors(e)&&!this.api.isMoveable(e)||this.currentAnimations.includes(e)||this.objectsInWaiting.includes(e)||(this.objectsInWaiting.push(e),this.dispatchUpdates())})),t(this,"addListener",(e=>{const t=this.api.getImageFileName(e);if(t){const e=this.api.getFileJSON();for(const s of e.archive)s.fileName.includes(t)&&this.sendEvent("addImage",JSON.stringify(s))}const s=this.api.getXML(e),i=this.api.getCommandString(e)&&this.api.getAlgorithmXML(e);this.sendEvent("addObject",i||s,e),this.sendEvent("deselect"),this.sendEvent("select",e,"true"),setTimeout((()=>this.initEmbed(e)),500)})),t(this,"removeListener",(e=>{this.sendEvent("deleteObject",e),delete this.embeds[e]})),t(this,"renameListener",((e,t)=>{this.sendEvent("renameObject",e,t)})),t(this,"lastEditingLabel",""),t(this,"clientListener",(e=>{let t,s,i;switch(e[0]){case"updateStyle":t=e[1],s=this.api.getXML(t),this.sendEvent("evalXML",s);break;case"editorStart":this.lastEditingLabel=e[1];break;case"editorKeyTyped":i=this.api.getEditorState(),this.sendEvent("setEditorState",i,e[1]||this.lastEditingLabel);break;case"editorStop":this.lastEditingLabel="",this.sendEvent("setEditorState",'{"content":""}');break;case"deselect":this.sendEvent(e[0]);break;case"select":this.sendEvent(e[0],e[1],e[2]);break;case"embeddedContentChanged":this.sendEvent(e[0],e[2],e[1]);break;case"undo":case"redo":case"addPolygonComplete":s=this.api.getXML(),this.sendEvent("setXML",s);break;case"addSlide":this.sendEvent(e[0]);break;case"removeSlide":case"moveSlide":case"selectSlide":case"clearSlide":case"orderingChange":this.sendEvent(e[0],e[2]);break;case"pasteSlide":this.sendEvent(e[0],e.cardIdx,e.ggbFile);break;case"startAnimation":t=e[1],this.currentAnimations.push(t),this.sendEvent(e[0],t,t);break;case"stopAnimation":t=e[1],this.currentAnimations.splice(this.currentAnimations.indexOf(t),1),this.sendEvent(e[0],t,t);break;case"groupObjects":case"ungroupObjects":this.sendEvent(e[0],e.targets);break;case"pasteElmsComplete":let n="";for(const t of e.targets)n+=this.api.getXML(t);this.sendEvent("evalXML",n);break;case"addGeoToTV":case"removeGeoFromTV":this.sendEvent(e[0],e[1]);break;case"setValuesOfTV":this.sendEvent(e[0],e[2]);break;case"showPointsTV":this.sendEvent(e[0],e.column,e.show);break;case"lockTextElement":case"unlockTextElement":this.sendEvent(e[0],e[1]);break;case"mouseDown":case"deleteGeos":break;default:console.debug("unhandled event ",e[0],e)}})),t(this,"conflictedObjects",[]),t(this,"dispatch",(e=>{var t,s,i;if(this.conflictedObjects.includes(e.label)&&"conflictResolution"!==e.type)return;const n=e.embedLabel?this.embeds[e.embedLabel]:this,a=e.type,r=e.label,l=e.content,o=null==(t=this.getUsers)?void 0:t.call(this);if(console.debug("receive:",a,r,l),"addObject"===a)if(n.api.exists(r))if(null==o?void 0:o.includes(this.clientId))if(this.clientId===String(Math.min(...o.map((e=>Number(e)))))){let e,t=1;do{e=`${r}_${t}`,t++}while(n.api.exists(e));this.unregisterListeners(),n.api.renameObject(r,e),this.registerListeners(),this.sendEvent("conflictResolution",n.api.getAlgorithmXML(e),r)}else this.conflictedObjects.push(r);else n.evalXML(l),n.api.previewRefresh();else n.evalXML(l),n.api.previewRefresh();else if("conflictResolution"===a){const e=this.conflictedObjects.indexOf(r);-1!==e&&this.conflictedObjects.splice(e,1),n.evalXML(l),n.api.previewRefresh()}else if("evalXML"===a)n.evalXML(l),n.api.previewRefresh();else if("setXML"===a)n.setXML(l);else if("evalCommand"===a)n.evalCommand(l),n.api.previewRefresh();else if("deleteObject"===a)n.unregisterListeners(),n===this&&delete this.embeds[l],n.api.deleteObject(l),n.registerListeners();else if("setEditorState"===a)n.unregisterListeners(),n.api.setEditorState(l,r),n.registerListeners();else if("addImage"===a){const e=JSON.parse(l);n.api.addImage(e.fileName,e.fileContent)}else if(["addSlide","removeSlide","moveSlide","clearSlide"].includes(a))n.api.handleSlideAction(a,l);else if("selectSlide"===a)n.unregisterListeners(),n.api.selectSlide(l),n.registerListeners();else if("renameObject"===a)n.unregisterListeners(),n.api.renameObject(l,r),n.registerListeners();else if("pasteSlide"===a)n.api.handleSlideAction(a,l,r);else if("evalGMContent"===a){const e=(n.api.getEmbeddedCalculators(!0)||{})[r];e&&e.loadFromJSON(l)}else if("startAnimation"===a)n.api.setAnimating(r,!0),n.api.startAnimation();else if("stopAnimation"===a)n.api.setAnimating(r,!1);else if("select"===a){(null==(s=this.getUsers)?void 0:s.call(this).includes(e.clientId))&&l&&n.api.addMultiuserSelection(e.clientId,"#000000",l,!!r)}else if("deselect"===a){(null==(i=this.getUsers)?void 0:i.call(this).includes(e.clientId))&&n.api.removeMultiuserSelections(e.clientId)}else"orderingChange"===a?n.api.updateOrdering(l):"groupObjects"===a?n.api.groupObjects(l):"ungroupObjects"===a?n.api.ungroupObjects(l):"addToGroup"===a?n.api.addToGroup(l,r):"embeddedContentChanged"===a?n.api.setEmbedContent(r,l):"addGeoToTV"===a?n.api.addGeoToTV(l):"setValuesOfTV"===a?n.api.setValuesOfTV(l):"removeGeoFromTV"===a?n.api.removeGeoFromTV(l):"showPointsTV"===a?n.api.showPointsTV(l,r):"lockTextElement"===a?n.api.lockTextElement(l):"unlockTextElement"===a?n.api.unlockTextElement(l):console.debug("unknown event",a,l,r)})),this.clientId=e.clientId,this.api=e.api,this.embedLabel=e.embedLabel,this.getUsers=e.getUsers,this.delay=null!=(s=e.delay)?s:200}createEvent(e,t,s){const i={type:e,content:t,clientId:this.clientId};return this.embedLabel&&(i.embedLabel=this.embedLabel),s&&(i.label=s),i}sendEvent(e,t,s){console.log("send:",e,s,t),a.service.postMessage(this.createEvent(e,t,s)),this.storageCallback||(this.storageCallback=setTimeout((()=>{a.service.setItem("ggbBase64",this.api.getBase64()),this.storageCallback=0}),this.delay))}evalCommand(e){this.unregisterListeners(),this.api.evalCommand(e),this.registerListeners()}evalXML(e){this.unregisterListeners(),this.api.evalXML(e),this.api.updateConstruction(),this.registerListeners(),setTimeout(this.initAllEmbeds,500)}setXML(e){this.unregisterListeners(),this.api.setXML(e),this.api.updateConstruction(),this.registerListeners()}initEmbed(e){if(this.embeds[e])return;const t=(this.api.getEmbeddedCalculators()||{})[e];if(t&&"registerClientListener"in t){const s=new a({clientId:this.clientId,getUsers:this.getUsers,api:t,embedLabel:e});s.registerListeners(),this.embeds[e]=s}}registerListeners(){this.api.registerUpdateListener(this.updateListener),this.api.registerRemoveListener(this.removeListener),this.api.registerAddListener(this.addListener),this.api.registerClientListener(this.clientListener),this.api.registerRenameListener(this.renameListener)}unregisterListeners(){this.api.unregisterUpdateListener(this.updateListener),this.api.unregisterRemoveListener(this.removeListener),this.api.unregisterAddListener(this.addListener),this.api.unregisterClientListener(this.clientListener),this.api.unregisterRenameListener(this.renameListener)}};let r=a;t(r,"service",n),async function(){await function(e){const t=s.get(e);if(t)return t;const i=document.createElement("script"),n=new Promise(((e,t)=>{i.onload=e,i.onerror=t}));return s.set(e,n),i.src=e,document.head.append(i),n}("https://www.geogebra.org/apps/deployggb.js");const e={appName:"classic",showMenuBar:!0,showAlgebraInput:!0,showToolBar:!0,customToolBar:"0 39 73 62 | 1 501 67 , 5 19 , 72 75 76 | 2 15 45 , 18 65 , 7 37 | 4 3 8 9 , 13 44 , 58 , 47 | 16 51 64 , 70 | 10 34 53 11 , 24  20 22 , 21 23 | 55 56 57 , 12 | 36 46 , 38 49  50 , 71  14  68 | 30 29 54 32 31 33 | 25 17 26 60 52 61 | 40 41 42 , 27 28 35 , 6",showToolBarHelp:!1,showResetIcon:!1,enableFileFeatures:!1,enableLabelDrags:!1,enableShiftDragZoom:!0,enableRightClick:!0,errorDialogsActive:!1,allowStyleBar:!1,preventFocus:!1,useBrowserForJS:!0,language:"en",width:800,height:600,borderColor:"transparent"},t=r.service.getItem("ggbBase64");t&&(e.ggbBase64=t),e.appletOnLoad=e=>{window.app=e,console.log("loaded");const t=new r({api:e,clientId:Math.random().toString(36).slice(2)});t.registerListeners(),window.live=t,r.service.addEventListener("message",(s=>{t.dispatch(s.data),e.setUndoPoint()}))};let i=new GGBApplet(e);i.inject(document.getElementById("app")),window.applet=i}();
