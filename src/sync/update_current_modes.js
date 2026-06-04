import log from '../logger.js'
import { gaCache } from '../cache.js'
import sorter from 'json-array-sorter'

export default async function(){
  try{
    let gaEvents = await gaCache.all('gaEventList', { league: 'KYBER' }, { _id: 0, eventInstanceId:1, season:1, mode: 1, startTime: 1, groupId: 1, bracketScanComplete: 1, displayEndTime: 1, counterScanComplete: 1, date: 1, league: 1 })
    gaEvents = sorter([{ column: 'startTime', order: 'descending'}], gaEvents?.filter(x=>x.bracketScanComplete) || [])
    if(!gaEvents || gaEvents?.length == 0) return
    let defaults = { '3v3': 0, '5v5': 0 }

    for(let i in gaEvents){
      let counters = await gaCache.get('playerList', { _id: gaEvents[i].groupId }, { counterIds: 1 })
      if(counters?.counterIds?.length > 5000 && gaEvents[i].season > defaults[gaEvents[i].mode]) defaults[gaEvents[i].mode] = gaEvents[i].season
    }
    if(Object.values(defaults)?.filter(x=>x > 0)?.length == 2) await gaCache.set('settings', { _id: 'modes' }, defaults )
    return gaEvents
  }catch(e){
    log.error(e)
  }
}
