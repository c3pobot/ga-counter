'use strict'
const sorter = require('json-array-sorter')
const mongo = require('mongoclient')
const scan = require('./scan')
const updateBattleCount = require('./updateBattleCount')
module.exports = async()=>{
  let gaEvents = await mongo.find('gaEvents', {})
  gaEvents = sorter([{ column: 'season', order: 'descending' }], gaEvents || [])
  if(!gaEvents || gaEvents?.length == 0) return
  let timeNow = Date.now()
  for(let i in gaEvents){
    if(!gaEvents[i]?.leagues?.KYBER || !gaEvents[i]?.leaderboardScanComplete || gaEvents[i].counterScanComplete) continue
    if(!gaEvents[i]?.endTime > timeNow) continue
    await scan({ ...gaEvents[i], ...gaEvents[i].leagues.KYBER })
    await updateBattleCount(gaEvents[i])
  }
}
