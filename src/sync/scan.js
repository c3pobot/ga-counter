import { eachLimit } from 'async'
import log from '../logger.js'
import { gaCache } from '../cache.js'
import checkIndex from './check_index.js'
import getPlayerIds from './get_player_ids.js'
import getHistory from './get_history.js'
import checkBattles from './check_battles.js'
import mapEventResult from './map_event_result.js'
import updateEventCount from './update_event_count.js'

let notify = {}
export default async function( gaEvent ){
  try{
    if(!gaEvent.groupId) return
    let indexExists = await checkIndex(`gaCounter-${gaEvent.season}`)
    if(!indexExists) return
    let startTime = Date.now(), endFound = false, count = 0, botSettingsUpdated, scanned = 0

    let counters = {}, gaEvents = [], completed = []
    let playerIds = await getPlayerIds(gaEvent.groupId)

    if(!playerIds || playerIds?.length == 0) return
    if(gaEvent.season && !notify[gaEvent.season]){
      notify[gaEvent.season] == 1
      log.info(`running counter scan for ${gaEvent.season} ${gaEvent.date} ${gaEvent.league}`)
    }
    await eachLimit(playerIds, 100, async(playerId)=>{
      let gaHistory = await getHistory(`${gaEvent.mode}/${playerId}.json`)
      if(!gaHistory?.matchResult || gaHistory.matchResult?.length == 0) return
      if(gaHistory?.eventInstanceId !== gaEvent.eventInstanceId) return

      completed.push(playerId)
      let res = checkBattles(gaHistory)
      if(res?.matchResult?.length > 0) gaEvents.push(res)
      scanned++
    })
    if(!gaEvents || gaEvents?.length == 0) return
    if(gaEvents?.length > 0){
      await eachLimit(gaEvents, 100, async(gaBattle)=>{
        await mapEventResult(gaBattle, counters)
      })

      eachLimit(gaEvents, 100, async(gaBattle)=>{
        updateEventCount(gaBattle, counters)
      })
      await eachLimit(counters, 100, async(counter)=>{
        if(!counter?.key || !counter?.season) return
        counter.rate = Math.round(counter.win / (counter.total) * 100)
        await gaCache.set(`gaCounter-${counter.season}`, { _id: counter.key }, counter)
        count++
      })
    }

    await eachLimit(completed, 100, async(playerId)=>{
      await gaCache.push('playerList', { _id: gaEvent.groupId }, { 'counterIds': playerId })
    })
    log.info(`finised counter scan for ${gaEvent.season} ${gaEvent.date} ${gaEvent.league} in ${((Date.now() - startTime) / 1000)?.toFixed(2)} seconds`)
  }catch(e){
    log.error(e)
  }
}
