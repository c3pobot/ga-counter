'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const sorter = require('json-array-sorter')
module.exports = async(gaEvent = {})=>{
  if(!gaEvent?.season) return
  let obj = await mongo.find('gaEvents', {}, { historyScanComplete: 1, leaderboardScanComplete: 1, season: 1, key: 1, _id: 1, endTime: 1, date: 1, counterScanComplete: 1 })
  if(!obj || obj.length == 0) return
  obj = sorter([{ column: 'endTime', order: 'descending' }], obj.filter(x=>x.endTime < Date.now()))
  let currentEvent = obj.shift()
  if(!currentEvent?.key) return
  let status = false
  for(let i in obj){
    if(obj[i].counterScanComplete) continue
    if(!obj[i].historyScanComplete) continue
    log.info(`Setting counter scan for ${obj[i].date} ${obj[i].season} to complete...`)
    await mongo.set('gaEvents', { _id: obj[i]._id }, { counterScanComplete: true })
    if(obj[i].key === gaEvent?.key) status = true
  }
  return status
}
