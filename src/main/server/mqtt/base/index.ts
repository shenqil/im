import mqtt from 'mqtt'

class MQTTBase {
  private client:mqtt.Client
  login(username:string,password:string){
    this.client = mqtt.connect({
      protocol:'mqtt',
      host:'localhost',
      port:1883,
      clientId:'PC',
      username,
      password
    })
  }
}
