'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const dbIndexes = require('./dbIndexes')
const getIndexes = async(collection)=>{
  try{
    return await mongo.listIndexes(collection)
  }catch(e){
    if(e?.stack?.includes('MongoServerError: ns does not exist:')) return
    log.error(e)
  }
}
const checkIndexes = async(collection, indexes = [])=>{
  try{
    for(let i in dbIndexes){
      if(indexes?.filter(x=>x.name === dbIndexes[i].name)?.length === 0) await addIndex(collection, dbIndexes[i])
    }
  }catch(e){
    log.error(e)
  }
}
const addIndex = async(collection, index = {})=>{
  log.info(`adding Index ${index.name} to ${collection}`)
  let status = await mongo.createIndex(collection, JSON.parse(JSON.stringify(index.data)), { name: index.name, background: true })
  //console.log(status)
}
module.exports = async(season)=>{
  if(!season) return
  let collection = `gaCounter-${season}`  
  let indexes = await getIndexes(collection)
  if(indexes) await checkIndexes(collection, indexes)

}
