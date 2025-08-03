import request from 'supertest'
import app from '../app'

import { TopicService } from '../services/topic.service'
import { jsonTopicDb } from '../db/fileDb'

describe('TopicService Unit Tests', () => {
  let service: TopicService
  beforeEach(() => {
    service = new TopicService(jsonTopicDb)
  })

  it('should create a topic', () => {
    const topic = service.create({ name: 'A', content: 'A content' })
    expect(topic.name).toBe('A')
    expect(topic.version).toBe(1)
  })

  it('should not create topic with missing fields', () => {
    expect(() => service.create({ name: '', content: '' })).toThrow()
  })

  it('should update a topic and increment version', () => {
    const topic = service.create({ name: 'A', content: 'A content' })
    const updated = service.update(topic.id, { content: 'new' })
    expect(updated.version).toBe(2)
    expect(updated.content).toBe('new')
  })

  it('should get a topic', () => {
    const topic = service.create({ name: 'A', content: 'A content' })
    const found = service.get(topic.id)
    expect(found?.id).toBe(topic.id)
  })

  it('should get a specific version', () => {
    const topic = service.create({ name: 'A', content: 'A content' })
    service.update(topic.id, { content: 'new' })
    const v1 = service.getVersion(topic.id, 1)
    const v2 = service.getVersion(topic.id, 2)
    expect(v1?.version).toBe(1)
    expect(v2?.version).toBe(2)
  })

  it('should delete a topic and its children', () => {
    const parent = service.create({ name: 'P', content: 'parent' })
    const child = service.create({ name: 'C', content: 'child', parentTopicId: parent.id })
    expect(service.get(child.id)).not.toBeNull()
    service.delete(parent.id)
    expect(service.get(parent.id)).toBeNull()
    expect(service.get(child.id)).toBeNull()
  })

  it('should return null for non-existent topic', () => {
    expect(service.get('not-exist')).toBeNull()
  })

  it('should build a topic tree', () => {
    const root = service.create({ name: 'Root', content: 'root' })
    const child = service.create({ name: 'Child', content: 'child', parentTopicId: root.id })
    const tree = service.getTree(root.id)
    expect(tree.children.length).toBe(1)
    expect(tree.children[0].id).toBe(child.id)
  })

  it('should find shortest path between topics', () => {
    const a = service.create({ name: 'A', content: 'A' })
    const b = service.create({ name: 'B', content: 'B', parentTopicId: a.id })
    const c = service.create({ name: 'C', content: 'C', parentTopicId: b.id })
    const path = service.shortestPath(a.id, c.id)
    expect(path).toEqual([a.id, b.id, c.id])
  })

  it('should return empty path if disconnected', () => {
    const a = service.create({ name: 'A', content: 'A' })
    const b = service.create({ name: 'B', content: 'B' })
    const path = service.shortestPath(a.id, b.id)
    expect(path).toEqual([])
  })
})
