import { Topic } from '../models/topic.model'

export interface ITopicDb {
  get(id: string): Topic[] | undefined
  set(id: string, versions: Topic[]): void
  has(id: string): boolean
  delete(id: string): void
  values(): IterableIterator<Topic[]>
}