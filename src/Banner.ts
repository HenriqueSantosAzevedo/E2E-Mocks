import figlet from 'figlet';
import chalk, { type ChalkInstance } from "chalk";

const { red } = chalk;

function removeChalkStyles(input: string) {
    const ansiRegex = /\x1b\[[0-9;]*m/g;
    return input.replace(ansiRegex, '');
}

export function getHeaderGenerator(style?: ChalkInstance) {
    let banner = '';
    let lines: string[] = [];

    return {
        addBanner(text: string) {
            banner = figlet.textSync(text, {
                font: "Roman",
                horizontalLayout: "default",
                verticalLayout: "default",
                width: 120,
                whitespaceBreak: true,
            });
        },
        addLine(...text: string[]) {
            lines.push(text.join(''));
        },
        build(): string {
            const paddingSize = 2;
            const tabSize = 4;
            const padding = ' '.repeat(tabSize * paddingSize);
            const bannerLines = banner.split('\n');
            const maxWidth = bannerLines.reduce((max, line) => Math.max(max, line.length), 0);
            const middleLine = '═'.repeat(maxWidth + (paddingSize * 2 * tabSize));

            return [
                (style ?? red)(`╔${middleLine}╗`),
                (style ?? red)(`║${padding}${' '.repeat(maxWidth)}${padding}║`),
                ...bannerLines.map(line => (style ?? red)(`║${padding}${line}${padding}║`)),
                ...lines.map(line => (style ?? red)(`║${padding}${line}${' '.repeat(maxWidth - removeChalkStyles(line).length)}${padding}║`)),
                (style ?? red)(`║${padding}${' '.repeat(maxWidth)}${padding}║`),
                (style ?? red)(`╚${middleLine}╝`),
            ].join('\n');
        }
    };
}