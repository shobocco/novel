export function battleOptions(enemy,enemies){const data=enemies[enemy]||{name:enemy,battleType:"final",bahamutConditionCost:5,bahamutTrustOnHeroFight:2};if(data.battleType==="final")return[{text:`${data.name}に全力で挑む`,result:"win"},{text:"敗北ルートを確認する（BAD END C）",result:"lose"}];return[{text:"自分で戦う",result:"win",mode:"hero"},{text:"バハムートに任せる",result:"win",mode:"bahamut"},{text:"撤退に失敗する（BAD END C）",result:"lose"}]}
export function applyBattleResult(state,enemy,enemies,option){const data=enemies[enemy]||{};if(option.result==="win"&&option.mode==="hero")state.bahamutTrust+=(data.bahamutTrustOnHeroFight||2);if(option.result==="win"&&option.mode==="bahamut"){state.bahamutCondition=Math.max(0,state.bahamutCondition-(data.bahamutConditionCost||5));state.bahamutBattleCount++}console.debug("Battle result",enemy,option)}
export const isRpgBattle=enemy=>["goblin","orc","demon_soldier","wyvern","golem","demon_king","god"].includes(enemy);

const battleSpecs={
  goblin:{hp:26,damage:5,guard:2,breath:26},
  orc:{hp:40,damage:6,guard:2,breath:40},
  demon_soldier:{hp:48,damage:7,guard:3,breath:48,tactical:true,strongDamage:44,strongGuardDamage:4,normalName:"素早い斬撃",strongName:"渾身の溜め斬り"},
  wyvern:{hp:54,damage:8,guard:3,breath:54,tactical:true,strongDamage:18,strongGuardDamage:4,normalName:"爪撃",strongName:"灼熱ブレス"},
  golem:{hp:70,damage:7,guard:3,breath:70,tactical:true,strongDamage:22,strongGuardDamage:5,normalName:"岩石の拳",strongName:"大地を砕く重撃"},
  demon_king:{hp:98,damage:10,guard:4,breath:36,tactical:true,strongDamage:24,strongGuardDamage:6,normalName:"魔剣の一閃",strongName:"暗黒魔法"},
  god:{hp:200,damage:14,guard:5,breath:0,tactical:true,strongDamage:34,strongGuardDamage:7,normalName:"光の槍",strongName:"裁きの神罰",alliesAuto:true}
};

export function createRpgBattle(enemy,enemies,state){
  const specs=battleSpecs[enemy]||{hp:30,damage:5,guard:2,breath:16};
  const finalBattle=["demon_king","god"].includes(enemy),heroLevel=finalBattle?Math.max(state.heroLevel||1,3):state.heroLevel||1,heroAttack=finalBattle?Math.max(state.heroAttack||8,12):state.heroAttack||8,heroMaxHp=finalBattle?Math.max(state.heroMaxHp||30,40):state.heroMaxHp||30;
  return{enemy,name:enemies[enemy]?.name||enemy,heroLevel,heroAttack,heroHp:heroMaxHp,heroMaxHp,heroMp:specs.tactical?6:0,heroMaxMp:specs.tactical?12:0,magicEnabled:!!specs.tactical,attackMagicCost:5,healMagicCost:6,enemyHp:specs.hp,enemyMaxHp:specs.hp,enemyDamage:specs.damage,guardDamage:specs.guard,bahamutDamage:specs.breath,strongDamage:specs.strongDamage||0,strongGuardDamage:specs.strongGuardDamage||0,normalAttackName:specs.normalName||"反撃",strongAttackName:specs.strongName||"強攻撃",enemyCharging:false,alliesAuto:!!specs.alliesAuto,bahamutAutoDamage:18,demonKingAutoDamage:14,turn:1,potionUsed:false,bahamutUsed:false,ended:false,growthApplied:false,log:specs.alliesAuto?`${enemies[enemy]?.name||enemy}が戦闘態勢に入った。\nバハムートと魔王が援護に入る！`:`${enemies[enemy]?.name||enemy}が戦闘態勢に入った。\n行動を選んでください。`}
}

const battleVariance=(turn,salt=0)=>(turn*2+salt)%5-2;
export function performRpgAction(b,state,enemies,action){
  if(b.ended)return b;
  let damage=0,incoming=b.enemyDamage,message="",guarding=false;
  if(action==="attack"){
    damage=Math.max(1,b.heroAttack+(b.magicEnabled?battleVariance(b.turn):0));
    if(b.magicEnabled)b.heroMp=Math.min(b.heroMaxMp,b.heroMp+2);
    message=`主人公の斬撃！ ${b.name}に${damage}ダメージ。${b.magicEnabled?" MPが2回復した。":""}`;
  }else if(action==="guard"){
    guarding=true;incoming=b.guardDamage;
    if(b.magicEnabled)b.heroMp=Math.min(b.heroMaxMp,b.heroMp+4);
    message=`主人公は盾を構えた。受けるダメージを軽減！${b.magicEnabled?" MPが4回復した。":""}`;
  }else if(action==="attack_magic"&&b.magicEnabled&&b.heroMp>=b.attackMagicCost){
    b.heroMp-=b.attackMagicCost;damage=Math.max(1,b.heroAttack+10+battleVariance(b.turn,1));message=`主人公の雷撃魔法！ ${b.name}に${damage}ダメージ。`;
  }else if(action==="heal_magic"&&b.magicEnabled&&b.heroMp>=b.healMagicCost){
    b.heroMp-=b.healMagicCost;const healed=Math.min(24,b.heroMaxHp-b.heroHp);b.heroHp+=healed;message=`主人公は回復魔法を唱え、HPが${healed}回復した。`;
  }else if(action==="potion"&&!b.magicEnabled&&!b.potionUsed){
    const healed=Math.min(10,b.heroMaxHp-b.heroHp);b.heroHp+=healed;b.potionUsed=true;message=`ポーションを使い、HPが${healed}回復した。`;
  }else if(action==="bahamut"&&!b.bahamutUsed&&!b.alliesAuto){
    damage=b.bahamutDamage;b.bahamutUsed=true;state.bahamutCondition=Math.max(0,state.bahamutCondition-(enemies[b.enemy]?.bahamutConditionCost||5));state.bahamutBattleCount++;message=`バハムートの灼熱の息！ ${b.name}に${damage}ダメージ。`;
  }else return b;
  if(b.alliesAuto){damage+=b.bahamutAutoDamage+b.demonKingAutoDamage;message+=`\nバハムートの追撃！ ${b.bahamutAutoDamage}ダメージ。\n魔王の暗黒魔法！ ${b.demonKingAutoDamage}ダメージ。`}
  b.enemyHp=Math.max(0,b.enemyHp-damage);
  if(b.enemyHp<=0){b.ended=true;b.result="win";b.log=`${message}\n${b.name}を倒した！`;return b}
  if(b.magicEnabled){
    if(b.enemyCharging){incoming=guarding?b.strongGuardDamage:b.strongDamage;message+=`\n${b.name}の${b.strongAttackName}！ 主人公は${incoming}ダメージを受けた。`;b.enemyCharging=false}
    else{incoming=guarding?b.guardDamage:Math.max(1,b.enemyDamage+battleVariance(b.turn,2));message+=`\n${b.name}の${b.normalAttackName}！ 主人公は${incoming}ダメージを受けた。`;b.enemyCharging=true;message+=`\n${b.name}が力を溜めている。次は${b.strongAttackName}だ！`}
  }else message+=`\n${b.name}の反撃！ 主人公は${incoming}ダメージを受けた。`;
  b.heroHp=Math.max(0,b.heroHp-incoming);
  if(b.heroHp<=0){b.ended=true;b.result="lose";b.log=`${message}\n主人公は力尽きた……。`;return b}
  b.turn++;b.log=message;return b
}
export function applyVictoryGrowth(state,balance,enemy){if(!["goblin","orc","demon_soldier","wyvern","golem"].includes(enemy))return null;state.heroBattlesWon=(state.heroBattlesWon||0)+1;state.heroLevel=(state.heroLevel||1)+1;state.heroMaxHp=(state.heroMaxHp||30)+(balance.hero?.hpGrowthPerWin||5);state.heroAttack=(state.heroAttack||8)+(balance.hero?.attackGrowthPerWin||2);return{level:state.heroLevel,maxHp:state.heroMaxHp,attack:state.heroAttack}}
