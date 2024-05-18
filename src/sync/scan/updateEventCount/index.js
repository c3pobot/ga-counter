'use strict'
const { eachLimit } = require('async')
const getDefenseResult = require('./getDefenseResult')
module.exports = async(gaEvent = {}, data = {})=>{
  await eachLimit(gaEvent.matchResult, 80, async(matchResult)=>{
    if(matchResult?.defenseResult?.length > 0) await getDefenseResult(matchResult.defenseResult, data)
  })
}
