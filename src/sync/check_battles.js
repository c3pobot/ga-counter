import sorter from 'json-array-sorter'
import updateBattles from './update_battles.js'
export default function(history = {}){
  let res = { _id: history._id, mode: history.mode, season: history.season, league: history.league, key: history.key, matchResult: [] }
  for(let i in history.matchResult){
    let battles = sorter([{ column: 'startTime', order: 'ascending' }], history.matchResult[i]?.defenseResult || [])
    let result = updateBattles(battles, history)
    if(result?.defenseResult?.length === history.matchResult[i].defenseResult.length) res.matchResult.push(result)
  }
  return res
}
