import { Topic } from '../models/topic.model'
import { ITopicDb } from './topic.interface'
import fs from 'fs'
import path from 'path'

const dbPath = path.join(__dirname, 'db.json')

function readDb() {
  if (!fs.existsSync(dbPath)) return { topics: {}, users: {}, resources: {} }
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
}

function writeDb(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

export const jsonTopicDb: ITopicDb = {
  get: (id) => {
    const db = readDb()
    return db.topics[id]
  },
  set: (id, versions) => {
    const db = readDb()
    db.topics[id] = versions
    writeDb(db)
  },
  has: (id) => {
    const db = readDb()
    return !!db.topics[id]
  },
  delete: (id) => {
    const db = readDb()
    delete db.topics[id]
    writeDb(db)
  },
  values: function* () {
    const db = readDb()
    for (const versions of Object.values(db.topics)) {
      yield versions as Topic[]
    }
  }
}