import fs from "node:fs";
import path from "node:path";

const root=path.resolve(import.meta.dirname,"..");
const read=file=>fs.readFileSync(path.join(root,"game/js",file),"utf8").trim();
const plain=file=>read(file).replace(/import\s+.*?\s+from\s+["'][^"']+["'];\s*/g,"").replace(/\bexport\s+(?=(?:const|function|class|async\s+function))/g,"");

const state=plain("game_state.js");
const save=plain("save.js");
const battle=plain("battle.js");
const ui=plain("ui.js").replace("const $=s=>document.querySelector(s)","const ui$=s=>document.querySelector(s)").replaceAll("$(", "ui$(");
const scenario=plain("scenario.js");
const main=plain("main.js");
const uiFacade="const UI={els,preloadVisualAssets,showScreen,updateStatus,background,prepareBackground,sceneTransition,showCharacter,hideCharacter,hideAll,showEnemy,hideEnemy,choices,renderRpgBattle,closeRpgBattle,toast,chapter,effect,documentModal,ending,error};";
const saveFacade="const Save={hasSave,save,load,clear};";

fs.writeFileSync(path.join(root,"game/js/game_bundle.js"),[state,save,battle,ui,uiFacade,saveFacade,scenario,main,""].join("\n\n"));
console.log("Generated game/js/game_bundle.js");
