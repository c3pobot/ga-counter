import log from './logger.js'
import { dataCache } from './cache.js'

let glUnits = new Set(), gameVersion

async function setUnits(){
  try{
    let faction = await dataCache.get('factionList', { _id: 'galactic_legend' })
    if(faction?.units) glUnits = new Set(faction.units)
  }catch(e){
    log.error(e)
  }
}
async function sync(){
  try{
    if(!dataCache.status()) return setTimeout(sync, 5000)
    let data = await dataCache.get('versions', { _id: 'unitList' }, { gameVersion: 1 })
    if(data?.gameVersion && data.gameVersion !== gameVersion){
      await setUnits()
      if(glUnits?.size > 0){
        gameVersion = data.gameVersion
        log.info(`game data updated to ${gameVersion}`)
        return setTimeout(sync, 30000)
      }
    }
    setTimeout(sync, 5000)
  }catch(e){
    log.error(e)
    setTimeout(sync, 5000)
  }
}
sync()
function checkGl(baseId){
  return glUnits.has(baseId)
}
function status(){
  if(glUnits.size > 0) return true
}
export default { checkGl, status }
