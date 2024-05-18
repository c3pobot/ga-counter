'use strict'
module.exports = (battle = {}, battles = [], index)=>{
  let tempBattle = JSON.parse(JSON.stringify(battle))
  for(let i in battles){
    if(i < index){
      for(let u in battles[i].defenderUnit){
        if(battles[i].defenderUnit[u].healthPercent < 100 || battles[i].defenderUnit[u].shieldPercent < 100) tempBattle.cleanUp = true
        if(battles[i].defenderUnit[u].healthPercent === 0){
          tempBattle.defenderUnit = tempBattle.defenderUnit.filter(x=>x.definitionId !== battles[i].defenderUnit[u].definitionId)
        }
      }
    }
  }
  return tempBattle
}
