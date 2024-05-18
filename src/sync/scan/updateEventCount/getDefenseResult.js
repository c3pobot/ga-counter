'use strict'
const { each } = require('async')
const getBattleResult = require('./getBattleResult')
module.exports = async(battles = [], data = {})=>{
  await each(battles, async(battle)=>{
    if(battle.key) await getBattleResult(battle, data)
  })
}
