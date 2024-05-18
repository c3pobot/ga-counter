'use strict'
const mongo = require('mongoclient')
module.exports = async(info = {})=>{
  let endFound = false, battleCount = {}
    let re = new RegExp('^'+info.season+'-')
    const obj = await mongo.aggregate('gaCounter', {_id: {$regex: re}}, [{
      $group: {
        _id: '$league',
        win: {
          $sum: '$win'
        },
        loss: {
          $sum: '$loss'
        },
        total: {
          $sum: '$total'
        }
      }
    }])
    if(obj?.length > 0){
      for(let i in obj){
        battleCount[obj[i]._id] = {
          win: +(obj[i].win || 0),
          loss: +(obj[i].loss || 0),
          total: +(obj[i].total || 0)
        }
      }
    }
    if(Object.values(battleCount)?.length > 0) info.battleCount = battleCount
    if(info.battleCount) await mongo.set('gaMeta', { _id: +info.season }, info)
    if(info.battleCount?.KYBER?.total > 1000){
      let botSettings = (await mongo.find('botSettings', {_id: "1"}))[0]
      if(botSettings && botSettings['ga-'+info.mode] && info.season > botSettings['ga-'+info.mode]) await mongo.set('botSettings', {_id: "1"}, {['ga-'+info.mode]: +info.season})
    }
}
