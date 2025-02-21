import type {Hono} from "hono";
import chalk from "chalk";
import {getStateHandlers, reset, resetAll} from "@/server/StateHandler.ts";

export function registerBaseRoutes(app: Hono) {
    app.get('--info', () => {
        const routes = app.routes.filter(r => !['/--reset/*', '/--info', '/*'].includes(r.path));

        getStateHandlers()
            .map(c => c.getId())
            .forEach(id => {
                routes.push({path: `--reset/${id}`, method: 'GET', handler: () => {}})
            })

        return Response.json(
            routes.map(({path, method}) => {
                return `${method} ${path}`
            }),
            {status: 200}
        );
    });

    app.get('--reset/hard', () => {

        resetAll();

        console.log(chalk.gray(`╚═══`));
        console.log(chalk.cyan(`    Resetting all states`));
        console.log(chalk.gray(`╔═══`));

        return Response.json({message: `Resetting all`}, {status: 200});
    });

    app.get('--reset/*', (c) => {
        const fullPath = c.req.path
        const id = fullPath.slice(9, fullPath.length);

        console.log(chalk.gray(`║\n╚═══`));
        console.log(chalk.cyan(`    Resetting ${id}`));
        console.log(chalk.gray(`╔═══\n║`));

        if (reset(id))
            return Response.json({message: `Resetting ${id}`}, {status: 200});

        return Response.json({message: `No state found for ${id}`}, {status: 404});
    });
}