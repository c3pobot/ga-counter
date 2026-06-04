'use strict'
const log = require('logger')
const fetch = require('node-fetch')
const GA_CACHE_URI = process.env.GA_CACHE_URI

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
module.exports = async( bucket, fileName )=>{
  try{
    if(!fileName) return
    let res = await fetch(`${GA_CACHE_URI}/${fileName}`, { headers: { 'Content-Type': 'application/json'}, timeout: 30000, compress: true, method: 'GET' })
    let data
    if (res?.headers?.get('Content-Type')?.includes('application/json')) data = await res.json()
    if(!data?.matchResult) return
    data.matchResult = data.matchResult.map(x=>{
      return {
        defenseResult: x.defenseResult.reduce((acc, current)=> acc.concat(mapDuel(current.duelResult)), [])
      }
    })
    return data
  }catch(e){
    log.error(e)
  }
}
