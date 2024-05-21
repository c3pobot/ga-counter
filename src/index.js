'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const sync = require('./sync')
const rabbitmq = require('./helpers/rabbitmq')
const exchanges = require('./exchanges')
const checkMongo = ()=>{
  try{
    let status = mongo.status()
    if(status) log.debug(`local mongo connection ready...`)
    if(status){
      startSync()
      return
    }
    log.debug(`mongo connection(s) not ready....`)
    setTimeout(checkMongo, 5000)
  }catch(e){
    log.error(e)
    setTimeout(checkMongo, 5000)
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
