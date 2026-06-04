import log from '../logger.js'
import { gaCache } from '../cache.js'


export default async function(gaEvents){
  try{
    gaEvents = gaEvents?.filter(x=>!x?.counterScanComplete)
    if(!gaEvents || gaEvents?.length == 0) return
    let currentEvent = gaEvents.shift()
    if(gaEvents?.length > 0){
      for(let i in gaEvents) await gaCache.set('gaEventList', { _id: gaEvents[i].groupId }, { counterScanComplete: true })
    }
    return currentEvent
  }catch(e){
    log.error(e)
  }
}
