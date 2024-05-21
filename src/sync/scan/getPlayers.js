'use strict'
const log = require('logger')
const mongo = require('mongoclient')
module.exports = async(gaEvent = {})=>{
  let gaHistPlayers = (await mongo.find('gaHistPlayers', { _id: gaEvent?.leagues?.KYBER?.groupId }))[0]
  if(!gaHistPlayers?.players || gaHistPlayers?.players?.length == 0) return
  let completedCounter = new Set(gaHistPlayers?.counter || []), historyComplete = new Set(gaHistPlayers.history || [])
  /*
  if(gaEvent.historyScanComplete && historyComplete.size > 0 && completedCounter.size > 0 && historyComplete.size === completedCounter.size){
    await mongo.set('gaEvents', { _id: gaEvent._id }, { counterScanComplete: true })
    log.info(`Counter scan for ${gaEvent.season} ${gaEvent.date} complete...`)
    return
  }
  */
  let players = gaHistPlayers?.players?.filter(x=>historyComplete.has(x) && !completedCounter.has(x)) || []
  log.debug(`${players?.length} available to scan...`)

  if(!players || players?.length == 0) return
  if(players?.length > 200) players = players.slice(0, 200)

  return players
}
