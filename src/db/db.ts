import { Topic } from '../models/topic.model'
import { ITopicDb } from './topic.interface'

const db = new Map<string, Topic[]>()

export const inMemoryTopicDb: ITopicDb = {
  get: (id) => db.get(id),
  set: (id, versions) => db.set(id, versions),
  has: (id) => db.has(id),
  delete: (id) => db.delete(id),
  values: () => db.values(),
}