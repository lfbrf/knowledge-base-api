import { Topic } from "../models/topic.model";

export class TopicFactory {
  static createVersion(base: Topic, data: { name?: string; content?: string }) {
    return new Topic(
      base.id,
      data.name ?? base.name,
      data.content ?? base.content,
      base.version + 1,
      base.parentTopicId
    )
  }
}