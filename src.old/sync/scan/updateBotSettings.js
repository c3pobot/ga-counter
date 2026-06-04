'use strict'
const mongo = require('mongoclient')
let current = { '5v5': 0, '3v3': 0 }
module.exports = async(mode, season)=>{
  if(!mode || !season) return
  if(current[mode] >= season) return
  let botSettings = (await mongo.find('botSettings', { _id: '1' }))[0]
  if(!botSettings) return
  let key = `ga-${mode}`
  if(!botSettings[key] || botSettings[key] < season){
    await mongo.set('botSettings', { _id: '1' }, { [key]: season })
    current[mode] = season
  }
}
