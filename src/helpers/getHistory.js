'use strict'
const log = require('logger')
const fetch = require('./fetch')
const S3_STORAGE_PUBLIC_URL = process.env.S3_STORAGE_PUBLIC_URL || "https://gahistory.c3po.wtf"
const fetch_options = { headers: { 'Content-Type': 'application/json'}, timeout: 30000, compress: true, method: 'GET' }
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

module.exports = async(bucket, file)=>{
  try{
    let res = await fetch(`${S3_STORAGE_PUBLIC_URL}/${file}`, fetch_options)
    if(res?.message) log.info(res.message)
    if(!res?.matchResult) return
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
