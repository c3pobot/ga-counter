'use strict'
const mongo = require('mongoclient')
const log = require('logger')
let glUnits = new Set(), gameVersion
const setGlUnits = async(data = {})=>{
  let obj = (await mongo.find('factions', { _id: 'galactic_legend' }))[0]
  if(!obj.units) throw('Error getting faction galactic_legend...')
  let tempSet = new Set(obj.units)
  glUnits = tempSet
}
const sync = async()=>{
  try{
    let gameData = (await mongo.find('botSettings', { _id: 'gameData' }, { version: 1 }))[0]
    if(!gameData?.version) throw('Error getting gameData...')
    if(gameVersion !== gameData?.Version){
      let status = await setGlUnits()
      if(status){
        gameVersion = data.gameVersion
        log.info(`updated gl-units to ${data.gameVersion}...`)
      }
    }
    setTimeout(sync, 10000)
  }catch(e){
    log.error(e)
    setTimeout(sync, 5000)
  }
}
const checkMongo = ()=>{
  try{
    let status = mongo.status()
    if(!status){
      setTimeout(checkMongo, 5000)
      return
    }
    log.info('starting sync of gl-units...')
    sync()
  }catch(e){
    log.error(e)
    setTimeout(checkMongo, 5000)
  }
}
checkMongo()
module.exports.checkGl = (defId)=>{
  return glUnits.has(defId)
}
module.exports.status = ()=>{
  if(glUnits.size > 0) return true
}
