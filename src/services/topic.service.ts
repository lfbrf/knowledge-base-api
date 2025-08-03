import { Topic } from '../models/topic.model'
import { v4 as uuid } from 'uuid'
import { TopicFactory } from './topic.factory'
import { ITopicDb } from '../db/topic.interface'
import { jsonTopicDb } from '../db/fileDb'

export class TopicService {
  private topicDb: ITopicDb

  constructor(topicDb: ITopicDb) {
    this.topicDb = topicDb
  }

  create(data: { name: string; content: string; parentTopicId?: string }) {
    if (!data.name || !data.content) {
      throw new Error('Missing required fields: name and content')
    }
    const id = uuid()
    const topic = new Topic(id, data.name, data.content, 1, data.parentTopicId)
    this.topicDb.set(id, [topic])
    return topic
  }

  get(id: string) {
    const versions = this.topicDb.get(id)
    return versions ? versions[versions.length - 1] : null
  }

  delete(id: string) {
    if (!this.topicDb.has(id)) throw new Error('Topic not found')
    this.topicDb.delete(id)
    for (const versions of this.topicDb.values()) {
      if (versions[0].parentTopicId === id) this.delete(versions[0].id)
    }
    return true
  }

  getVersion(id: string, version: number) {
    const versions = this.topicDb.get(id)
    return versions?.find(v => v.version === version) ?? null
  }

  update(id: string, data: { name?: string; content?: string }) {
    const versions = this.topicDb.get(id)
    if (!versions) throw new Error('Topic not found')
    const latest = versions[versions.length - 1]
    const updated = TopicFactory.createVersion(latest, data)
    versions.push(updated)
    this.topicDb.set(id, versions)
    return updated
  }

  getTree(id: string) {
    const root = this.get(id)
    if (!root) return null

    const buildTree = (id: string): any => {
      const topic = this.get(id)
      const children = Array.from(this.topicDb.values())
        .flat()
        .filter(t => t.parentTopicId === id)
      return {
        ...topic,
        children: [...new Set(children.map(c => c.id))].map(buildTree)
      }
    }

    return buildTree(id)
  }

  shortestPath(fromId: string, toId: string): string[] {
    const graph: Record<string, string[]> = {}
    for (const versions of this.topicDb.values()) {
      const topic = versions[versions.length - 1]
      if (!graph[topic.id]) graph[topic.id] = []
      if (topic.parentTopicId) {
        graph[topic.id].push(topic.parentTopicId)
        if (!graph[topic.parentTopicId]) graph[topic.parentTopicId] = []
        graph[topic.parentTopicId].push(topic.id)
      }
    }

    const queue: [string, string[]][] = [[fromId, [fromId]]]
    const visited = new Set<string>()

    while (queue.length) {
      const [current, path] = queue.shift()!
      if (current === toId) return path
      visited.add(current)
      for (const neighbor of graph[current] || []) {
        if (!visited.has(neighbor)) queue.push([neighbor, [...path, neighbor]])
      }
    }

    return []
  }
}
export const topicService = new TopicService(jsonTopicDb)
