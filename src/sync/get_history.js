import log from '../logger.js'

const GA_CACHE_URI = process.env.GA_CACHE_URI || 'http://ga-cache:3000'
async function parseResponse(r){
  let contentType = r?.headers.get("content-type")
  if(contentType && contentType?.indexOf("application/json") !== -1) return await r?.json()
}

function mapUnits(units = []){
  return units.map(x=>{
    return { baseId: x.definitionId?.split(':')[0], definitionId: x.definitionId, healthPercent: x.healthPercent, shieldPercent: x.shieldPercent, squadUnitType: x.squadUnitType }
  })
}
function mapDuel(duelResult = []){
  return duelResult.map(x=>{
    return { battleOutcome: x.battleOutcome, startTime: x.startTime, defenderDatacron: x.defenderDatacron, attackerDatacron: x.attackerDatacron, attackerUnit: mapUnits(x.attackerUnit), defenderUnit: mapUnits(x.defenderUnit) }
  })
}
export default async function(fileName){
  try{
    if(!fileName) return
    let opts = { headers: { 'Content-Type': 'application/json'}, signal: AbortSignal.timeout(30000), compress: true, method: 'GET' }
    let r = await fetch(`${GA_CACHE_URI}/${fileName}`, opts)
    let res = await parseResponse(r)
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
