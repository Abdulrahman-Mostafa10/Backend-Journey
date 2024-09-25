import { Router } from 'jsr:@oak/oak/router';

import { Todo } from '../models/todo.ts';

let todos: Todo[] = [];

const router = new Router();

router.get('/', (ctx) => {
    ctx.response.status = 200;
    ctx.response.body = { todos: todos };
});

router.post('/todo', async (ctx) => {
    const body = await ctx.request.body.json();
    const newTodo: Todo = {
        id: new Date().toISOString(),
        text: body.text
    };
    todos.push(newTodo);
    ctx.response.status = 201;
    ctx.response.body = { message: 'Created new todo', todo: newTodo };
});

router.put('/todo/:todoId', async (ctx) => {
    const { todoId } = ctx.params as { todoId: string };
    const todoIndex = todos.findIndex(todoItem => todoItem.id == todoId);
    const body = await ctx.request.body.json();

    if (todoIndex >= 0) {
        todos[todoIndex] = { id: todos[todoIndex].id, text: body.text };
        ctx.response.status = 200;
        ctx.response.body = { message: 'Updated todo' };
    } else {
        ctx.response.status = 404;
        ctx.response.body = { message: 'Could not find todo for this id' };
    }
});

router.delete('/todo/:todoId', (ctx) => {
    const { todoId } = ctx.params as { todoId: string };
    todos = todos.filter(todoItem => todoItem.id !== todoId);
    ctx.response.status = 200;
    ctx.response.body = { message: 'Deleted todo' };
});

export default router;