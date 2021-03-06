import { spawn } from 'child_process';
import moment from 'moment';
import { Expiry } from './interfaces';

/**
 * Execute the command using node-cmd in an ASYNC function, using the current stdio.
 * @param command The command to run
 */
export function getAsync(command: string) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, { stdio: 'inherit', shell: true });

    process.on('error', error => {
      reject(new Error(`${command} encountered error ${error.message}`));
    });
    process.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`${command} exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Converts the given Time Unit to an appropriate one for moment.js
 * @param unit The unit to convert
 */
export function convertTimes(unit: string) {
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

export function isValidDuration(amount: number | string, unit: string) {
  return (
    // Check if first parameter number (amount)
    isNaN(amount as any) ||
    // Check if second parameter is a string (unit)
    typeof unit !== 'string' ||
    // Chck if valid duration
    moment
      .duration(parseInt(amount as any, 10), convertTimes(unit) as any)
      .toISOString() !== 'P0D'
  );
}

/**
 * Parses the given string "5hours" into an expiry object [5, "hours"]
 * @param value The value to parse
 */
export function parseDuration(value: string): Expiry {
  const exp = value.split(/([0-9]+)/).filter(v => v !== '');

  // Make sure the expiry arguments are correct
  if (exp.length === 2 && isValidDuration(exp[0], exp[1])) {
    return [parseInt(exp[0], 10), convertTimes(exp[1]) as any];
  } else {
    throw new Error(
      `Incorrect value for expiry, must be in format "<NumberUnit>"`
    );
  }
}
