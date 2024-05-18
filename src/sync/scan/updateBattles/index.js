'use strict'
const sorter = require('json-array-sorter')
const updateBattles = require('./updateBattles')
module.exports = (history = {})=>{
  let res = { _id: history._id, mode: history.mode, season: history.season, league: history.league, key: history.key, matchResult: [] }
  for(let i in history.matchResult){
    let battles = sorter([{ column: 'startTime', order: 'ascending' }], history.matchResult[i]?.defenseResult || [])
    let result = updateBattles(battles, history)
    if(result?.defenseResult?.length === history.matchResult[i].defenseResult.length) res.matchResult.push(result)
  }
  return res
}
