import { ResourceService } from '../services/resource.service'

describe('ResourceService', () => {
  let service: ResourceService
  beforeEach(() => {
    service = new ResourceService()
  })

  it('should create a resource', () => {
    const resource = service.create({ topicId: '1', url: 'http://a', description: 'desc', type: 'pdf' })
    expect(resource.url).toBe('http://a')
  })

  it('should get a resource', () => {
    const resource = service.create({ topicId: '1', url: 'http://a', description: 'desc', type: 'pdf' })
    expect(service.get(resource.id)).not.toBeNull()
  })

    it('should throw if missing fields on create', () => {
    expect(() => service.create({} as any)).toThrow()
  })

  it('should create and get a resource', () => {
    const resource = service.create({ topicId: '1', url: 'u', description: 'd', type: 'pdf' })
    expect(service.get(resource.id)).toEqual(resource)
  })

  it('should return null for non-existent resource', () => {
    expect(service.get('notfound')).toBeNull()
  })

  it('should update a resource', () => {
    const resource = service.create({ topicId: '1', url: 'u', description: 'd', type: 'pdf' })
    const updated = service.update(resource.id, { description: 'new' })
    expect(updated.description).toBe('new')
  })

  it('should throw when updating non-existent resource', () => {
    expect(() => service.update('notfound', { description: 'x' })).toThrow()
  })

  it('should delete a resource', () => {
    const resource = service.create({ topicId: '1', url: 'u', description: 'd', type: 'pdf' })
    service.delete(resource.id)
    expect(service.get(resource.id)).toBeNull()
  })

  it('should throw when deleting non-existent resource', () => {
    expect(() => service.delete('notfound')).toThrow()
  })

})