import {Hono} from "hono";
import chalk from "chalk";
import {handleResponse, importCurrentFiles} from "@/server/RequestResolver.ts";
import {registerBaseRoutes} from "@/server/BaseRoutes.ts";
import { logger } from 'hono/logger'
import {customLogger} from "@/server/Logger.ts";
import {isEntry} from "@/types/Entry.ts";
import {handleReset} from "@/server/StateHandler.ts";

export function startServer(port: number) {
    const app = new Hono();

    console.log('')
    try {
        Bun.serve({
            fetch: app.fetch,
            port,
        })
        console.log(chalk.green(` 🚀 Server running on http://localhost:${port}`));

        registerBaseRoutes(app);

        app.use(logger(customLogger))

        importCurrentFiles()
            .then(entries => {
                for (const entry of entries) {
                    if (!isEntry(entry))
                        continue;

                    handleReset(entry.state);
                    handleResponse(app, entry);
                }
                console.log(chalk.blue(`    Registered ${entries.length} routes`));
            })
            .then(() => {
                console.log(chalk.gray(`\n╔═══\n║`));
            });

    } catch (e) {
        console.error(chalk.red(`        🚨 Error starting server:\n\n        ${e}\n\n\n\n`));
    }
}