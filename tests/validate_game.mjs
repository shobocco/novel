import fs from "node:fs";
import path from "node:path";
import {applyVictoryGrowth,createRpgBattle,isRpgBattle,performRpgAction} from "../game/js/battle.js";

const root=path.resolve(import.meta.dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const files=Object.fromEntries(fs.readdirSync(path.join(root,"scenario")).filter(x=>x.endsWith(".json")).map(x=>[x,read(`scenario/${x}`)]));
const balance=read("game/data/game_balance.json"),enemies=read("game/data/enemies.json");
const errors=[];
const directBundle=fs.readFileSync(path.join(root,"game/js/game_bundle.js"),"utf8");
const indexHtml=fs.readFileSync(path.join(root,"game/index.html"),"utf8");
const gameCss=fs.readFileSync(path.join(root,"game/css/style.css"),"utf8");
if(/document\.write\s*\(/.test(indexHtml))errors.push("game/index.html: document.write remains and can fail during Firefox file:// startup");
if(!indexHtml.includes('loadScript("scenario_bundle.js",()=>loadScript("game_bundle.js"))'))errors.push("game/index.html: ordered file:// bundle loading is missing");
if(!gameCss.includes("height:100dvh")||!gameCss.includes("safe-area-inset-bottom"))errors.push("style.css: compact mobile battle viewport/safe-area handling is missing");
if(/import\s+.*?\s+from\s+["']/.test(directBundle))errors.push("game_bundle.js: ES module import remains in the file:// classic bundle");
if(/\bexport\s+(?:const|function|class|async\s+function)\b/.test(directBundle))errors.push("game_bundle.js: ES module export remains in the file:// classic bundle");
if(/\bstructuredClone\b/.test(directBundle))errors.push("game_bundle.js: structuredClone remains and can break older Firefox file:// startup");
if(!directBundle.includes("els.modal.onclick=close"))errors.push("game_bundle.js: document modal is not dismissible from the whole overlay");
try{new Function(directBundle)}catch(error){errors.push(`game_bundle.js: classic script parse failed: ${error.message}`)}
try{
  const elements=new Map(),makeElement=()=>{const classes=new Set(),attributes=new Map();return{classList:{add(...names){names.forEach(name=>classes.add(name))},remove(...names){names.forEach(name=>classes.delete(name))},toggle(name,force){const enabled=force??!classes.has(name);enabled?classes.add(name):classes.delete(name);return enabled},contains(name){return classes.has(name)}},style:{},dataset:{},innerHTML:"",textContent:"",disabled:false,onclick:null,addEventListener(){},append(){},remove(){},querySelectorAll(){return[]},setAttribute(name,value){attributes.set(name,String(value))},getAttribute(name){return attributes.get(name)??null}}};
  const documentStub={querySelector(selector){if(!elements.has(selector))elements.set(selector,makeElement());return elements.get(selector)},querySelectorAll(){return[]}};
  const localStorageStub={getItem(){throw Error("SecurityError")},setItem(){throw Error("SecurityError")},removeItem(){throw Error("SecurityError")}};
  class ImageStub{constructor(){this.dataset={};this.style={}}set src(value){this._src=value;queueMicrotask(()=>this.onload?.())}get src(){return this._src}remove(){}}
  const windowStub={CACHE_BUST:Date.now()};
  const consoleStub={...console,warn(){},debug(){}};
  const scenarioBundle=fs.readFileSync(path.join(root,"game/js/scenario_bundle.js"),"utf8");
  new Function("window",scenarioBundle)(windowStub);
  const fastTimeout=(callback)=>setTimeout(callback,0);
  new Function("window","document","localStorage","Image","fetch","addEventListener","getComputedStyle","requestAnimationFrame","console","setTimeout","setInterval","clearInterval",directBundle)(windowStub,documentStub,localStorageStub,ImageStub,async()=>{throw Error("file protocol")},()=>{},()=>({backgroundImage:"none"}),callback=>callback(),consoleStub,fastTimeout,setInterval,clearInterval);
  await new Promise(resolve=>setTimeout(resolve,0));
  if(typeof documentStub.querySelector("#start-btn").onclick!=="function")errors.push("game_bundle.js: GAME START handler was not registered during classic-script boot");
  if(typeof documentStub.querySelector("#skip-btn").onclick!=="function")errors.push("game_bundle.js: SKIP handler was not registered during classic-script boot");
  await documentStub.querySelector("#start-btn").onclick();
  const skipButton=documentStub.querySelector("#skip-btn");skipButton.onclick();
  if(skipButton.getAttribute("aria-pressed")!=="true"||skipButton.textContent!=="SKIP ON")errors.push("game_bundle.js: SKIP did not activate during file:// fallback play");
  skipButton.onclick();
}catch(error){errors.push(`game_bundle.js: classic-script boot failed: ${error.message}`)}

for(const[file,data]of Object.entries(files)){
  if(!data.scenes[data.startScene])errors.push(`${file}: bad startScene`);
  for(const[id,scene]of Object.entries(data.scenes))for(const step of scene.steps){
    for(const key of["scene","next","trueNext","falseNext","successNext","failureNext","winNext","loseNext"])if(step[key]&&!data.scenes[step[key]])errors.push(`${file}/${id}: ${key} -> ${step[key]}`);
    if(step.type==="loadScenario"&&!files[step.file])errors.push(`${file}/${id}: missing ${step.file}`);
    if(step.type==="choice")for(const option of step.options)if(option.next&&!data.scenes[option.next])errors.push(`${file}/${id}: choice -> ${option.next}`);
  }
}

const initial=()=>({money:balance.initialMoney,loanPayment:balance.loan.payment,loanPaymentsMade:0,heroLevel:balance.hero.initialLevel,heroMaxHp:balance.hero.initialMaxHp,heroAttack:balance.hero.initialAttack,heroBattlesWon:0,bahamutValue:balance.bahamut.initialValue,bahamutCondition:balance.bahamut.initialCondition,bahamutTrust:balance.bahamut.initialTrust,bahamutBattleCount:0,route:"common",flags:{},defeatedBy:null});
const cmp=(a,o,b)=>({"==":a==b,"!=":a!=b,">":a>b,">=":a>=b,"<":a<b,"<=":a<=b}[o]);
function appraisal(s){const b=balance.bahamut,c=s.bahamutCondition,t=s.bahamutTrust,n=s.bahamutBattleCount;return s.bahamutValue+(c>=90?b.conditionBonus[90]:c>=70?b.conditionBonus[70]:c>=50?b.conditionBonus[50]:b.conditionBonus.below50)+(t>=20?b.trustBonus[20]:t>=10?b.trustBonus[10]:t<0?b.trustBonus.below0:b.trustBonus.default)+(n>=6?b.overusePenalty[6]:n>=4?b.overusePenalty[4]:n>=3?b.overusePenalty[3]:n>=2?b.overusePenalty[2]:b.overusePenalty.default)}

function simulate(policy){
  const state=initial(),reachedBattles=[];let file="chapter01_intro.json",data=files[file],scene=data.startScene,index=0,guard=0;
  while(guard++<3000){
    const step=data.scenes[scene].steps[index++];if(!step)throw Error(`stuck ${file}/${scene}`);
    const go=next=>{scene=next;index=0};
    if(step.type==="set")state[step.variable]=step.value;
    if(step.type==="add")state[step.variable]=(state[step.variable]||0)+step.value;
    if(step.type==="subtract")state[step.variable]=(state[step.variable]||0)-step.value;
    if(step.type==="setFlag")state.flags[step.flag]=step.value;
    if(step.type==="reward")state.money+=step.amount??balance.rewards[step.enemy];
    if(step.type==="choice"){
      const choice=policy.choice(file,step);if(!choice)throw Error(`missing choice policy: ${file}/${scene}`);
      for(const action of choice.actions||[]){if(action.type==="set")state[action.variable]=action.value;if(action.type==="add")state[action.variable]=(state[action.variable]||0)+action.value;if(action.type==="subtract")state[action.variable]=(state[action.variable]||0)-action.value;if(action.type==="setFlag")state.flags[action.flag]=action.value}go(choice.next);
    }
    if(step.type==="battle"){
      reachedBattles.push(step.enemy);const mode=policy.battle(file,step);
      if(mode==="hero")state.bahamutTrust+=enemies[step.enemy]?.bahamutTrustOnHeroFight||2;
      if(mode==="bahamut"){state.bahamutCondition-=enemies[step.enemy]?.bahamutConditionCost||5;state.bahamutBattleCount++}
      if(mode!=="lose")applyVictoryGrowth(state,balance,step.enemy);go(mode==="lose"?step.loseNext:step.winNext);
    }
    if(step.type==="loanPayment"){if(state.money>=state.loanPayment){state.money-=state.loanPayment;state.loanPaymentsMade++;go(step.successNext)}else go(step.failureNext)}
    if(step.type==="condition")go(cmp(state[step.variable],step.operator,step.value)?step.trueNext:step.falseNext);
    if(step.type==="conditionFlag")go(state.flags[step.flag]===step.value?step.trueNext:step.falseNext);
    if(step.type==="jump")go(step.scene);
    if(step.type==="appraisal"){state.finalAppraisal=appraisal(state);go(state.finalAppraisal>=(step.requiredValue??balance.bahamut.normalEndingRequiredValue)?step.successNext:step.failureNext)}
    if(step.type==="loadScenario"){file=step.file;data=files[file];scene=data.startScene;index=0}
    if(step.type==="ending")return{ending:step.id,state,reachedBattles};
  }
  throw Error("infinite loop");
}

const plans={normal:{journey:0,route:0,battle:"hero"},bad_a:{journey:1,route:0,battle:"hero"},bad_b:{journey:0,route:0,battle:"bahamut"},bad_c:{journey:0,route:0,battle:"hero",lose:"demon_king"},bad_d:{journey:0,route:0,battle:"hero",lose:"goblin"},good:{journey:0,route:1,battle:"hero"}};
const expected={normal:"normal_end",bad_a:"bad_end_a",bad_b:"bad_end_b",bad_c:"bad_end_c",bad_d:"bad_end_d",good:"good_end"};
for(const[name,plan]of Object.entries(plans)){
  const result=simulate({choice:(file,step)=>step.options[file.includes("chapter06")?plan.journey:plan.route],battle:(_file,step)=>plan.lose===step.enemy?"lose":plan.battle});
  console.log(`${name}: ${result.ending} money=${result.state.money} payments=${result.state.loanPaymentsMade} appraisal=${result.state.finalAppraisal??"-"}`);
  if(result.ending!==expected[name])errors.push(`${name}: expected ${expected[name]}, got ${result.ending}`);
  if(["normal","bad_b","good"].includes(name)&&result.state.loanPaymentsMade!==6)errors.push(`${name}: expected 6 payments, got ${result.state.loanPaymentsMade}`);
  if(name==="normal"&&!['wyvern','golem','demon_soldier'].every(enemy=>result.reachedBattles.includes(enemy)))errors.push("normal: an added battle was not reached");
}

const added=["demon_soldier","wyvern","golem"];
for(const enemy of added){
  if(!isRpgBattle(enemy))errors.push(`${enemy}: not an RPG battle`);
  const png=path.join(root,enemies[enemy].asset),webp=png.replace(/\.png$/i,".webp");
  if(!fs.existsSync(png)||!fs.existsSync(webp))errors.push(`${enemy}: missing PNG or WebP asset`);
  const loss=simulate({choice:(_file,step)=>step.options[0],battle:(_file,step)=>step.enemy===enemy?"lose":"hero"});
  if(loss.ending!=="bad_end_d"||loss.state.defeatedBy!==enemy)errors.push(`${enemy}: defeat did not preserve defeatedBy and reach BAD END D`);
  const state=initial(),beforeCondition=state.bahamutCondition,beforeCount=state.bahamutBattleCount,battle=createRpgBattle(enemy,enemies,state);performRpgAction(battle,state,enemies,"bahamut");
  if(state.bahamutCondition!==beforeCondition-enemies[enemy].bahamutConditionCost||state.bahamutBattleCount!==beforeCount+1)errors.push(`${enemy}: Bahamut usage did not update condition/count`);
}

for(const enemy of["goblin","orc",...added]){
  const loss=simulate({choice:(_file,step)=>step.options[0],battle:(_file,step)=>step.enemy===enemy?"lose":"hero"});
  if(loss.ending!=="bad_end_d"||loss.state.defeatedBy!==enemy)errors.push(`${enemy}: ordinary-monster defeat did not preserve defeatedBy and reach BAD END D`);
}

const stats=Object.fromEntries(["goblin","orc","demon_soldier","wyvern","golem","demon_king"].map(enemy=>[enemy,createRpgBattle(enemy,enemies,initial())]));
for(const[a,b]of[["goblin","orc"],["orc","demon_soldier"],["demon_soldier","wyvern"],["wyvern","golem"],["golem","demon_king"]])if(stats[a].enemyMaxHp>=stats[b].enemyMaxHp)errors.push(`battle curve: ${a} HP must be lower than ${b}`);

const growthState=initial();for(const enemy of["goblin","orc","wyvern","golem","demon_soldier"])applyVictoryGrowth(growthState,balance,enemy);
if(growthState.heroLevel!==6||growthState.heroMaxHp!==55||growthState.heroAttack!==18)errors.push(`growth: expected LV6/HP55/ATK18, got LV${growthState.heroLevel}/HP${growthState.heroMaxHp}/ATK${growthState.heroAttack}`);

const combatState=initial();
for(const enemy of["goblin","orc"]){const battle=createRpgBattle(enemy,enemies,combatState);while(!battle.ended)performRpgAction(battle,combatState,enemies,"attack");if(battle.result!=="win")errors.push(`${enemy}: expected an attack-only victory`);applyVictoryGrowth(combatState,balance,enemy)}
const tacticalEnemies=["wyvern","golem","demon_soldier","demon_king","god"];
const storyStats={wyvern:[3,40,12],golem:[4,45,14],demon_soldier:[5,50,16],demon_king:[6,55,18],god:[6,55,18]};
for(const enemy of tacticalEnemies){
  const[level,maxHp,attack]=storyStats[enemy],makeState=()=>({...initial(),heroLevel:level,heroMaxHp:maxHp,heroAttack:attack});
  const attackState=makeState(),attackOnly=createRpgBattle(enemy,enemies,attackState);while(!attackOnly.ended)performRpgAction(attackOnly,attackState,enemies,"attack");if(attackOnly.result!=="lose")errors.push(`${enemy}: attack-only play should lose`);
  const tacticalState=makeState(),tactical=createRpgBattle(enemy,enemies,tacticalState);while(!tactical.ended){const action=tactical.enemyCharging?"guard":tactical.heroMp>=tactical.attackMagicCost?"attack_magic":"attack";performRpgAction(tactical,tacticalState,enemies,action)}if(tactical.result!=="win")errors.push(`${enemy}: guarding telegraphed attacks and using magic should win`);
}
applyVictoryGrowth(combatState,balance,"wyvern");
const healingWyvern=createRpgBattle("wyvern",enemies,combatState);performRpgAction(healingWyvern,combatState,enemies,"attack");performRpgAction(healingWyvern,combatState,enemies,"guard");const hpBeforeHeal=healingWyvern.heroHp;performRpgAction(healingWyvern,combatState,enemies,"heal_magic");if(healingWyvern.heroHp<=hpBeforeHeal)errors.push("wyvern: healing magic should produce a net HP gain on a normal enemy turn");

for(const background of["bg_dungeon_entrance","bg_dungeon","bg_demon_realm"]){for(const ext of["png","webp"])if(!fs.existsSync(path.join(root,`assets/backgrounds/${background}.${ext}`)))errors.push(`${background}: missing ${ext}`)}

if(errors.length){console.error(errors.join("\n"));process.exit(1)}
console.log("All scenario references, six ending routes, added RPG battles, assets, growth, and Bahamut effects passed.");
