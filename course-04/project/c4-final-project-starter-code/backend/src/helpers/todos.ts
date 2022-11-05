import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
// import * as createError from 'http-errors'
import * as uuid from 'uuid'
import { getUserId } from '../lambda/utils'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { TodoItem } from '../models/TodoItem'

// // TODO: Implement businessLogic

export function todoBuilder (todoRequest: CreateTodoRequest, event: APIGatewayProxyEvent): TodoItem {
    const todoId = uuid.v4()

    const todo = {
      "todoId": todoId,
      "userId": getUserId(event),
      "createdAt": new Date().toISOString(),
      "done": false,
      "attachmentUrl": "",
      ...todoRequest
    }

    return todo as TodoItem
}
