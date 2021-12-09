import {types as soup} from 'mediasoup';
import { randomUUID } from 'crypto';
import mediasoupConfig, { MediasoupConfig } from '../mediasoupConfig';
import Client from './Client';
import { getMediasoupWorker } from '../modules/mediasoupWorkers';
// import { RoomState } from '@sharedTypes/types';
export default class Room {
  router: soup.Router;
  id: string;
  clients: Map<string, Client> = new Map();

  static async createRoom(id: string = randomUUID(), worker?: soup.Worker): Promise<Room> {
    const routerOptions: soup.RouterOptions = {};
    if(mediasoupConfig.router.mediaCodecs){
      routerOptions.mediaCodecs = mediasoupConfig.router.mediaCodecs;
    }
    if(!worker){
      worker = getMediasoupWorker();
    }
    const router = await worker.createRouter(routerOptions);
    const createdRoom = new Room(id, router);
      
    return createdRoom;
  }

  private constructor(id: string, router: soup.Router) {
    this.router = router;
    this.id = id;
  }

  getRtpCapabilities(): soup.RtpCapabilities {
    return this.router.rtpCapabilities;
  }

  addClient(client: Client){
    if(this.clients.has(client.id)){
      console.warn('This client is already in the room!!');
      return false;
    }
    this.clients.set(client.id, client);
    // this.broadcastRoomState();

    return true;
  }
  removeClient(client: Client){
    if(!client.id){
      console.warn('invalid client object provided when trying to remove client from room. id missing!');
      return false;
    }
    const ok = this.clients.delete(client.id);
    // this.broadcastRoomState();
    return ok;
  }
  // broadcastRoomState(clientToSkip?: Client){
  //   const roomState: RoomState = {
  //     producers: [],
  //     consumers: [],
  //     clients: [],
  //   };
  //   this.clients.forEach((client) => {
  //     if(clientToSkip && clientToSkip === client){
  //       return;
  //     }
  //     client.roomStateUpdated(roomState);
  //   });
  // }
}