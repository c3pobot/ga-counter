import log from '../logger.js'
import updateCurrentModes from './update_current_modes.js'
import getCurrentEvent from './get_current_event.js'
import scan from './scan.js'

async function sync(){
  try{
    let gaEvents = await updateCurrentModes()

    if(!gaEvents || gaEvents?.length == 0) return

    let gaEvent = await getCurrentEvent(gaEvents)
    if(!gaEvent?.displayEndTime < Date.now()) await scan(gaEvent)
    setTimeout(sync, 5000)
  }catch(e){
    log.error(e)
    setTimeout(sync, 5000)
  }
}

export default { start: sync }
