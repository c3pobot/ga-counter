'use strict'
const { checkGl } = require('src/helpers/gameData')
const sorter = require('json-array-sorter')
module.exports = (battle = {})=>{
  let tempObj = { key: null, attackLeader: null, defendLeader: null, attackGl: false, defendGl: false, attackSquad: null, defendSquad: null, noLead: false }
  if(battle.cleanup) tempObj.id += 'cleanup'
  let attackLeader = battle.attackerUnit?.find(x=>x?.squadUnitType === 3 || x?.squadUnitType === 2)
  let defendLeader = battle.defenderUnit?.find(x=>x?.squadUnitType === 3 || x?.squadUnitType === 2)
  let defendUnits = sorter([{column: 'baseId', order: 'ascending'}], battle.defenderUnit?.filter(x=>x?.squadUnitType === 1))
  let attackUnits = sorter([{column: 'baseId', order: 'ascending'}], battle.attackerUnit?.filter(x=>x?.squadUnitType === 1))
  if(!defendUnits) defendUnits = []
  if(!attackUnits) attackUnits = []
  if(attackLeader?.baseId){
    attackUnits.unshift(attackLeader)
    tempObj.attackLeader = attackLeader.baseId
  }
  if(defendLeader?.baseId){
    defendUnits.unshift(defendLeader)
    tempObj.defendLeader = defendLeader.baseId
  }else{
    tempObj.noLead = true
  }
  if(attackUnits?.length > 0 && defendUnits?.length > 0){
    for(let i in defendUnits){
      if(!tempObj.key){
        tempObj.key = ''
        if(battle.cleanUp) tempObj.key += 'cleanup-'
        tempObj.key += 'd'+defendUnits[i].baseId
      }else{
        tempObj.key += '-d'+defendUnits[i].baseId
      }

      if(!tempObj.defendSquad){
        tempObj.defendSquad = defendUnits[i].baseId
      }else{
        tempObj.defendSquad += '-'+defendUnits[i].baseId
      }
      if(!tempObj.defendGl) tempObj.defendGl = checkGl(defendUnits[i].baseId)
    }
    if(tempObj.key){
      for(let i in attackUnits){
        tempObj.key += '-a'+attackUnits[i].baseId
        if(!tempObj.attackSquad){
          tempObj.attackSquad = attackUnits[i].baseId
        }else{
          tempObj.attackSquad += '-'+attackUnits[i].baseId
        }
        if(!tempObj.attackGl) tempObj.attackGl = checkGl(attackUnits[i].baseId)
      }

      if(tempObj.attackGl){
        tempObj.key += `-attackGl`
      }else{
        tempObj.key += `-noAttackGl`
      }
      if(tempObj.defendGl){
        tempObj.key += `-defendGl`
      }else{
        tempObj.key += `-noDefendGl`
      }
      if(tempObj.noLead) tempObj.key += `-noLead`
      if(battle.attackUnitCount === 1) tempObj.key += `-singleAttacker`
      if(battle.defendUnitCount === 1) tempObj.key += `-singleDefender`
      tempObj.key += '-'
      delete battle.attackerUnit
      delete battle.defenderUnit
      delete battle.attackerDatacron
      delete battle.defenderDatacron
      return {...battle, ...tempObj}
    }
  }
}
