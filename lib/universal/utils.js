"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const moment_1 = __importDefault(require("moment"));
/**
 * Execute the command using node-cmd in an ASYNC function, using the current stdio.
 * @param command The command to run
 */
function getAsync(command) {
    return new Promise((resolve, reject) => {
        const process = child_process_1.spawn(command, { stdio: 'inherit', shell: true });
        process.on('error', error => {
            reject(new Error(`${command} encountered error ${error.message}`));
        });
        process.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`${command} exited with code ${code}`));
            }
            else {
                resolve();
            }
        });
    });
}
exports.getAsync = getAsync;
/**
 * Converts the given Time Unit to an appropriate one for moment.js
 * @param unit The unit to convert
 */
function convertTimes(unit) {
    switch (unit) {
        case 'min':
            return 'minute';
        case 'mins':
            return 'minutes';
        case 'sec':
            return 'second';
        case 'secs':
            return 'seconds';
        default:
            return unit;
    }
}
exports.convertTimes = convertTimes;
function isValidDuration(amount, unit) {
    return (
    // Check if first parameter number (amount)
    isNaN(amount) ||
        // Check if second parameter is a string (unit)
        typeof unit !== 'string' ||
        // Chck if valid duration
        moment_1.default
            .duration(parseInt(amount, 10), convertTimes(unit))
            .toISOString() !== 'P0D');
}
exports.isValidDuration = isValidDuration;
/**
 * Parses the given string "5hours" into an expiry object [5, "hours"]
 * @param value The value to parse
 */
function parseDuration(value) {
    const exp = value.split(/([0-9]+)/).filter(v => v !== '');
    // Make sure the expiry arguments are correct
    if (exp.length === 2 && isValidDuration(exp[0], exp[1])) {
        return [parseInt(exp[0], 10), convertTimes(exp[1])];
    }
    else {
        throw new Error(`Incorrect value for expiry, must be in format "<NumberUnit>"`);
    }
}
exports.parseDuration = parseDuration;
