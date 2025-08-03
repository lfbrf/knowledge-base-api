import { BaseEntity } from './base.entity'

export class Topic extends BaseEntity {
  name: string
  content: string
  version: number
  parentTopicId?: string

  constructor(id: string, name: string, content: string, version: number, parentTopicId?: string) {
    super(id)
    this.name = name
    this.content = content
    this.version = version
    this.parentTopicId = parentTopicId
  }
}