'use strict'
const log = require('logger')
const fetch = require('node-fetch')
const GA_HIST_OBJECT_STORAGE_ENDPOINT = process.env.GA_HIST_OBJECT_STORAGE_ENDPOINT
const mapUnits = (units = [])=>{
  return units.map(x=>{
    return { baseId: x.definitionId?.split(':')[0], definitionId: x.definitionId, healthPercent: x.healthPercent, shieldPercent: x.shieldPercent, squadUnitType: x.squadUnitType }
  })
}
const mapDuel = (duelResult = [])=>{
  return duelResult.map(x=>{
    return { battleOutcome: x.battleOutcome, startTime: x.startTime, defenderDatacron: x.defenderDatacron, attackerDatacron: x.attackerDatacron, attackerUnit: mapUnits(x.attackerUnit), defenderUnit: mapUnits(x.defenderUnit) }
  })
}
const fetchHistory = async(bucket, file)=>{
  try{
    if(!GA_HIST_OBJECT_STORAGE_ENDPOINT) return
    let opts = { timeout: 30000, compress: true, method: 'GET' }
    let res = await fetch(`${GA_HIST_OBJECT_STORAGE_ENDPOINT}:${bucket}/${file}.json`, opts)
    if(res.status == 200) return await res.json()
  }catch(e){
    if(!e?.name || !e?.message){
      if(e.status) log.error(e.status)
      log.error(e)
    }    
  }
}
module.exports = async(bucket, file)=>{
  try{
    let res = await fetchHistory(bucket, file)
    if(!res?.matchResult || res.matchResult?.length == 0) return
    res.matchResult = res.matchResult.map(x=>{
      return {
        defenseResult: x.defenseResult.reduce((acc, current)=> acc.concat(mapDuel(current.duelResult)), [])
      }
    })
    return res
  }catch(e){
    log.error(e)
  }
}
