'use strict'
const mongo = require('mongoclient')
module.exports = async(battle = {}, data = {})=>{
  if(!battle.key || !battle.season) return
  if(data[battle.key]) return
  let tempCounter = (await mongo.find('gaCounter', {_id: battle.season+'-'+battle.key}, {_id: 0, TTL: 0}))[0]
  if(tempCounter){
    data[battle.key] = tempCounter
  }else{
    data[battle.key] = battle
  }
}
