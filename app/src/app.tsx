import { Elysia, t } from 'elysia';
import { staticPlugin } from '@elysiajs/static'
import { html } from '@elysiajs/html';
import * as elements from 'typed-html';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { items } from './db/schema';
import * as Components from './components';

const app = new Elysia()
    .use(html())
    .use(staticPlugin())
    .decorate('db', db)
    .get('/', ({ html }) => html(
        <Components.BaseHtml>
            <Components.LandingPage />
        </Components.BaseHtml>
    ))
    .get('/items', async ({ db }) => {
        const data = await db.select().from(items).all();
        return <Components.ItemList items={data} />
    })
    .delete(
        '/items/:id',
        async ({ db, params }) => {
            await db.delete(items).where(eq(items.id, params.id)).run();
        },
        {
            params: t.Object({
                id: t.Numeric(),
            })
        }
    )
    .post(
        '/items',
        async ({ db, body }) => {
            if (body.title.length === 0) {
                throw new Error('Title cannot be empty');
            }
            const newItem = await db
                .insert(items)
                .values(body)
                .returning();
                //.get(); // does not work yet with bun-sqlite3: https://github.com/drizzle-team/drizzle-orm/issues/1153
            return <Components.ItemElement {...newItem.pop()} />;
        },
        {
            body: t.Object({
                title: t.String(),
                content: t.String(),
            })
        }
    )
    .listen(process.env.PORT || 3000);

console.log(`
 /$$$$$$$  /$$$$$$$$  /$$$$$$  /$$   /$$ /$$$$$$$$
| $$__  $$| $$_____/ /$$__  $$| $$  | $$|__  $$__/
| $$  \\ $$| $$      | $$  \\__/| $$  | $$   | $$   
| $$$$$$$ | $$$$$   |  $$$$$$ | $$$$$$$$   | $$   
| $$__  $$| $$__/    \\____  $$| $$__  $$   | $$   
| $$  \\ $$| $$       /$$  \\ $$| $$  | $$   | $$   
| $$$y$$$/| $$$$$$$$|  $kana$/| $$  | $$   | $$   
|_______/ |________/ \\______/ |__/  |__/   |__/   

Elysia server is running at http://${app.server?.hostname}:${app.server?.port}
Hack away!
`);
