'use strict'
const mongo = require('mongoclient')
const log = require('logger')
let glUnits = new Set()
const setGlUnits = async(data = {})=>{
  try{
    let status = mongo.status()
    if(!status){
      setTimeout(setGlUnits, 5000)
      return
    }
    let obj = (await mongo.find('factions', { _id: 'galactic_legend' }))[0]
    if(obj?.units){
      let tempSet = new Set(obj.units)
      glUnits = tempSet
      if(data?.gameVersion){
        log.info(`updated game data to ${data.gameVersion}`)
        return
      }
      log.info(`updated game data`)
      return
    }
    setTimeout(setGlUnits, 5000)
  }catch(e){
    log.error(e)
    setTimeout(setGlUnits, 5000)
  }
}
setGlUnits()
module.exports.checkGl = (defId)=>{
  return glUnits.has(defId)
}
module.exports.setGlUnits = setGlUnits
