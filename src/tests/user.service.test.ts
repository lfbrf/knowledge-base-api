import { UserService } from '../services/user.service'

describe('UserService', () => {
  let service: UserService
  beforeEach(() => {
    service = new UserService()
  })

  it('should create a user', () => {
    const user = service.create({ name: 'A', email: 'a@b.com', role: 'Admin' })
    expect(user.role).toBe('Admin')
  })

  it('should get a user', () => {
    const user = service.create({ name: 'A', email: 'a@b.com', role: 'Admin' })
    expect(service.get(user.id)).not.toBeNull()
  })

  it('should delete a user', () => {
    const user = service.create({ name: 'A', email: 'a@b.com', role: 'Admin' })
    service.delete(user.id)
    expect(service.get(user.id)).toBeNull()
  })
})