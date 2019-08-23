import Room from '../room/room'
import WallSprite from '../../interfaces/wallSprite/wallSprite'

import Config from 'config'

const ENEMY_GRID_VAL = Config.game.room.gridVals.enemy

class Map {
  constructor(p) {
    this.level = 1
    this.startingRoom = new Room(0, 0)
    this.startingRoom.updateGrid(0, 0, ENEMY_GRID_VAL)
    this.currentRoom = this.startingRoom
    this.rooms = { '0,0': this.startingRoom }

    this.sprite = new WallSprite(p)

    this.initiateRooms()
  }

  initiateRooms = () => {
    const paths = [
      [0, 1, this.startingRoom, 'south'],
      [1, 0, this.startingRoom, 'west'],
      [0, -1, this.startingRoom, 'north'],
      [-1, 0, this.startingRoom, 'south']
    ]
    const roomsStrings = ['0,0']
    const rooms = [this.startingRoom]
    for (let i = 0; i < this.level; i++) {
      const temp = paths.splice(Math.floor(Math.random() * paths.length), 1)[0]
      temp[2].end = false
      const newRoom = new Room(temp[0], temp[1])
      // eslint-disable-next-line prefer-destructuring
      newRoom[temp[3]] = temp[2]
      temp[2][this.getOppositeDir(temp[3])] = newRoom
      const newPaths = this.getSurroundings(newRoom)
      for (let n = 0; n < newPaths.length; n++) {
        const newPath = newPaths[n]
        if (!roomsStrings.includes(`${newPath[0]},${newPath[1]}`)) {
          paths.push(newPath)
        }
      }
      rooms.push(newRoom)
      this.rooms[`${newRoom.x},${newRoom.y}`] = newRoom
      roomsStrings.push(`${newRoom.x},${newRoom.y}`)
    }

    const endingRooms = []

    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i]
      if (room.end) {
        endingRooms.push(room)
      }
    }

    endingRooms[Math.floor(Math.random() * endingRooms.length)].trueEnd = true
  }

  move = dir => {
    this.currentRoom = this.currentRoom[dir]
  }

  update = () => {
    this.sprite.draw()
  }

  getSurroundings = room => {
    return [
      [room.x, room.y + 1, room, 'south'],
      [room.x + 1, room.y, room, 'west'],
      [room.x, room.y - 1, room, 'north'],
      [room.x - 1, room.y, room, 'east']
    ]
  }

  getOppositeDir = dir => {
    switch (dir) {
      case 'south':
        return 'north'
      case 'west':
        return 'east'
      case 'north':
        return 'south'
      case 'east':
        return 'west'
      default:
        return ''
    }
  }
}

export default Map
