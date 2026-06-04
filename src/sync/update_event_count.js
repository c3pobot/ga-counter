import { each, eachLimit } from 'async'
function getBattleResult(battle = {}, data = {}){
  if(!battle.key || !data[battle.key]) return
  data[battle.key].total++
  if(battle.battleOutcome === 1){
    data[battle.key].win++
  }else{
    data[battle.key].loss++
  }
}
function getDefenseResult(battles = [], data = {}){
  each(battles, (battle)=>{
    if(battle.key) getBattleResult(battle, data)
  })
}
export default function(gaEvent = {}, data = {}){
  eachLimit(gaEvent.matchResult, 80, (matchResult)=>{
    if(matchResult?.defenseResult?.length > 0) getDefenseResult(matchResult.defenseResult, data)
  })
}
