#! /usr/bin/env bun
import chalk from "chalk";
import yargs from "yargs";
import {hideBin} from "yargs/helpers";
import {startServer} from "@/server/Server.ts";
import {getHeaderGenerator} from "@/Banner.ts";

const argv = yargs(hideBin(process.argv))
    .option("port", {
        alias: "p",
        type: "number",
        description: "Port to run the server on",
        default: 3000, // Default port
    })
    .option("no-banner", {
        alias: "b",
        type: "boolean",
        description: "Disable the banner",
        default: false
    })
    .help()
    .alias("help", "h")
    .parse() as { port: number, noBanner: boolean };

if (!argv.noBanner) {
    const { gray, cyan, red } = chalk;
    const { addLine, addBanner, build } = getHeaderGenerator(cyan);
    addBanner("E2E-Mocks");
    addLine(gray`DO NOT USE THIS IN PRODUCTION!`);
    addLine(gray`This is a tool for `, red`integration tests only`, gray`.`);
    console.log(build())
}

startServer(argv.port as number);