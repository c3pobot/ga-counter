import { each } from 'async'
import { gaCache } from '../cache.js'
async function getBattleResult(battle = {}, data = {}){
  if(!battle.key || !battle.season) return
  if(data[battle.key]) return
  let tempCounter = await gaCache.get(`gaCounter-${battle.season}`, { _id: battle.key }, {_id: 0, TTL: 0})
  if(tempCounter){
    data[battle.key] = tempCounter
  }else{
    data[battle.key] = battle
  }
}
async function getDefenseResult(battles = [], data = {}){
  if(battles?.length > 0){
    await each(battles, async(battle)=>{
      if(battle?.key) await getBattleResult(battle, data)
    })
  }
}
export default async function(gaEvent = {}, data = {}){
  if(gaEvent.matchResult?.length > 0){
    await each(gaEvent.matchResult, async(matchResult)=>{
      if(matchResult?.defenseResult?.length > 0) await getDefenseResult(matchResult.defenseResult, data)
    })
  }
}
