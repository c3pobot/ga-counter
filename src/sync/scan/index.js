'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const { eachLimit, each } = require('async')

const getHistory = require('src/helpers/getHistory')
const updateBattles = require('./updateBattles')
const mapEventResult = require('./mapEventResult')
const updateEventCount = require('./updateEventCount')
const getPlayers = require('./getPlayers')
const updateBotSettings = async(info = {})=>{
  let botSettings = (await mongo.find('botSettings', { _id: "1" }))[0]
  if(botSettings && botSettings['ga-'+info.mode] && info.season > botSettings['ga-'+info.mode]) await mongo.set('botSettings', {_id: "1"}, {['ga-'+info.mode]: +info.season})
  return true
}
let notify = {}

module.exports = async(info = {})=>{
  let startTime = Date.now(), endFound = false, count = 0, botSettingsUpdated
  log.debug(`running counter scan for ${info.season} ${info.date} ${info.league}`)
  if(info.season && !notify[info.season]){
    notify[info.season] == 1
    log.info(`running counter scan for ${info.season} ${info.date} ${info.league}`)
  }
  while(!endFound){
    let counters = {}, gaEvents = [], completed = []
    let players = await getPlayers(info)
    if(!players || players?.length == 0) endFound = true
    await eachLimit(players, 80, async(playerId)=>{
      let gaHistory = await getHistory(`ga-history-season-${info.season}`, `${playerId}-${info.key}`)
      if(!gaHistory?.matchResult || gaHistory.matchResult?.length == 0) return
      completed.push(playerId)
      let res = updateBattles(gaHistory)
      if(res?.matchResult?.length > 0) gaEvents.push(res)
    })
    if(!gaEvents || gaEvents?.length === 0) endFound = true
    if(gaEvents?.length > 0){
      await eachLimit(gaEvents, 100, async(gaEvent)=>{
        await mapEventResult(gaEvent, counters)
      })

      await eachLimit(gaEvents, 100, async(gaEvent)=>{
        await updateEventCount(gaEvent, counters)
      })
      await eachLimit(counters, 100, async(counter)=>{
        if(!counter?.key || !counter?.season) return
        counter.rate = Math.round(counter.win / (counter.total) * 100)
        await mongo.set('gaCounter', {_id: counter.season+'-'+counter.key}, counter)
        count++
      })
    }

    await eachLimit(completed, 100, async(playerId)=>{
      await mongo.push('gaHistPlayers', { _id: info.groupId }, { 'counter': playerId })
    })
    if(count > 200 && !botSettingsUpdated) botSettingsUpdated = await updateBotSettings(info)
  }
  let timeDiff = (Date.now() - startTime) / 1000
  log.debug(`finised counter scan for ${info.season} ${info.date} ${info.league} in ${timeDiff} seconds`)
}
