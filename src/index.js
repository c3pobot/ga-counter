'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const sync = require('./sync')
const gameData = require('./helpers/gameData')
const checkMongo = ()=>{
  try{
    let status = mongo.status()
    if(status){
      log.debug(`local mongo connection ready...`)
      checkData()
      return
    }
    log.debug(`mongo connection(s) not ready....`)
    setTimeout(checkMongo, 5000)
  }catch(e){
    log.error(e)
    setTimeout(checkMongo, 5000)
  }
}
const checkData = ()=>{
  try{
    let status = gameData.status()
    if(status){
      startSync()
      return
    }
    setTimeout(checkData, 5000)
  }catch(e){
    log.error(e)
    setTimeout(checkData, 5000)
  }
}
const startSync = async()=>{
  try{
    let syncTime = 5
    let status = await sync()
    if(status) syncTime = 60
    setTimeout(startSync, syncTime * 1000)
  }catch(e){
    log.error(e)
    setTimeout(startSync, 5000)
  }
}
checkMongo()
