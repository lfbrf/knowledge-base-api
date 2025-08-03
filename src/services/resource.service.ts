import { Resource } from '../models/resource.model'
import { v4 as uuid } from 'uuid'

const resourceDb = new Map<string, Resource>()

export class ResourceService {
  create(data: { topicId: string; url: string; description: string; type: string }) {
    if (!data.topicId || !data.url || !data.type) throw new Error('Missing required fields')
    const resource = new Resource(uuid(), data.topicId, data.url, data.description, data.type)
    resourceDb.set(resource.id, resource)
    return resource
  }
  get(id: string) {
    return resourceDb.get(id) || null
  }
  update(id: string, data: Partial<Omit<Resource, 'id' | 'createdAt'>>) {
    const resource = resourceDb.get(id)
    if (!resource) throw new Error('Resource not found')
    Object.assign(resource, data, { updatedAt: new Date() })
    return resource
  }
  delete(id: string) {
    if (!resourceDb.has(id)) throw new Error('Resource not found')
    resourceDb.delete(id)
    return true
  }
  listByTopic(topicId: string) {
    return Array.from(resourceDb.values()).filter(r => r.topicId === topicId)
  }
}
export const resourceService = new ResourceService()