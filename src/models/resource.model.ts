import { BaseEntity } from './base.entity'

export class Resource extends BaseEntity {
  topicId: string
  url: string
  description: string
  type: string

  constructor(id: string, topicId: string, url: string, description: string, type: string) {
    super(id)
    this.topicId = topicId
    this.url = url
    this.description = description
    this.type = type
  }
}