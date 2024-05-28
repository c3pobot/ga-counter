'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const updateBotSettings = require('./updateBotSettings')
module.exports = async(gaEvent = {})=>{
  let gaHistPlayers = (await mongo.find('gaHistPlayers', { _id: gaEvent?.leagues?.KYBER?.groupId }))[0]
  if(!gaHistPlayers?.players || gaHistPlayers?.players?.length == 0) return
  let completedCounter = new Set(gaHistPlayers?.counter || []), historyComplete = new Set(gaHistPlayers.history || [])
  if(completedCounter.size > 2000) updateBotSettings(gaHistPlayers.mode, gaHistPlayers.season)

  if(gaEvent.historyScanComplete && historyComplete.size > 0 && completedCounter.size > 0){
    let counterCompletePlayers = gaHistPlayers?.history?.filter(x=>!completedCounter.has(x))
    if(counterCompletePlayers?.length === 0){
      log.info(`Counter scan for ${gaEvent.season} ${gaEvent.date} complete...`)
      await mongo.set('gaEvents', { _id: gaEvent._id }, { counterScanComplete: true })
      return
    }

  }

  let players = gaHistPlayers?.players?.filter(x=>historyComplete.has(x) && !completedCounter.has(x)) || []
  log.debug(`${players?.length} available to scan...`)
  if(!players || players?.length == 0) return
  if(players?.length > 200) players = players.slice(0, 200)

  return players
}
