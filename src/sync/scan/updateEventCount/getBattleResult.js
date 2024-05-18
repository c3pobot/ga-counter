'use strict'
module.exports = (battle = {}, data = {})=>{
  if(!battle.key || !data[battle.key]) return
  data[battle.key].total++
  if(battle.battleOutcome === 1){
    data[battle.key].win++
  }else{
    data[battle.key].loss++
  }
}
