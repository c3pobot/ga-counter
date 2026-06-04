'use strict'
const { each } = require('async')
const getDefenseResult = require('./getDefenseResult')
module.exports = async(gaEvent = {}, data = {})=>{
  if(gaEvent.matchResult?.length > 0){
    await each(gaEvent.matchResult, async(matchResult)=>{
      if(matchResult?.defenseResult?.length > 0) await getDefenseResult(matchResult.defenseResult, data)
    })
  }
}
