import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')

// // TODO: Implement the dataLayer logic

const todosTable = process.env.TODOS_TABLE
const index = process.env.TODOS_CREATED_AT_INDEX

const docClient: DocumentClient = createDynamoDBClient()

export async function createTodo (todo: TodoItem): Promise<TodoItem> {
    await docClient.put({
      TableName: todosTable,
      Item: todo
    }).promise()

    return todo
}

export async function updateTodo (todo: TodoItem, update: UpdateTodoRequest): Promise<TodoItem> {
  await docClient.update({
    TableName: todosTable,
    Key: {
      userId: todo.userId,
      todoId: todo.todoId
    },
    UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#dueDate': 'dueDate',
      '#done': 'done'
    },
    ExpressionAttributeValues: {
      ':name': update.name,
      ':dueDate': update.dueDate,
      ':done': update.done
    }
  }).promise()

  return todo
}

export async function deleteTodo (todo: TodoItem): Promise<TodoItem> {
  await docClient.delete({
    TableName: todosTable,
    Key: {
      userId: todo.userId,
      todoId: todo.todoId
    },
  }).promise()

  return todo
}

export async function getAllTodosByUserId (userId: string): Promise<TodoItem[]> {
  const result = await docClient.query({
    TableName : todosTable,
    KeyConditionExpression: '#userId = :userId',
    ExpressionAttributeNames: {
      '#userId': 'userId'
    },
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise()

  return result.Items as TodoItem[]
}

export async function getTodoById (todoId: string): Promise<TodoItem> {
  const result = await docClient.query({
    TableName : todosTable,
    IndexName: index,
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues: {
      ':todoId': todoId
    }
  }).promise()

  return result.Items[0] as TodoItem
}

export async function updateTodoById (todo: TodoItem): Promise<TodoItem> {
  const result = await docClient.update({
    TableName : todosTable,
    Key: {
      userId: todo.userId,
      todoId: todo.todoId
    },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': todo.attachmentUrl
    }
  }).promise()

  return result.Attributes as TodoItem
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }
