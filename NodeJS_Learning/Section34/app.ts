import { Application } from "jsr:@oak/oak/application";

import todosRoutes from './routes/todo.ts';

const app = new Application();

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

await app.listen({ port: 3000 });