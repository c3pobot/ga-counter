'use strict'
const getCleanup = require('./getCleanup')
module.exports = (battle = {}, battles = [])=>{
  let leader = battle.defenderUnit.find(x=>x.squadUnitType === 3 || x.squadUnitType === 2)
  if(leader?.definitionId){
    let tempArray = battles.filter(x=>x.defenderUnit.filter(y=>y.definitionId === leader.definitionId).length > 0)
    if(tempArray?.length > 0){
      let index = tempArray.findIndex(x=>x.startTime === battle.startTime)
      if(index === 0){
        return JSON.parse(JSON.stringify(battle))
      }else{
        return getCleanup(battle, tempArray, index)
      }
    }
  }
}
