import chalk from "chalk";

export function customLogger( message: string, ...rest: string[] ) {

    message = message.toString().replace(/^<--/g, chalk.green`<--`).replace(/-->/g, chalk.red`-->`);
    message = message.replace(/POST/g, chalk.cyan`POST`);
    message = message.replace(/PUT/g, chalk.blue`PUT`);
    message = message.replace(/DELETE/g, chalk.yellow`DELETE`);
    message = message.replace(/GET/g, chalk.green`GET`);

    console.log(
        chalk.gray("║   "),
        ` [ ${chalk.green(new Date().toLocaleString())} ] ${message} `,
        rest.length > 0 ? '==>' : '',
        ...rest
    );
}