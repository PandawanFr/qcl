"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const data_1 = require("../universal/data");
const utils_1 = require("../universal/utils");
const cleanup = __importStar(require("./cleanup"));
/**
 * Installs the given package
 * @param pkgName The package to install
 */
async function run(pkgName, expiry) {
    await cleanup.run();
    if (!pkgName) {
        throw new Error('No package was given.');
    }
    if (expiry &&
        (expiry.length !== 2 || !utils_1.isValidDuration(expiry[0], expiry[1]))) {
        throw new Error('Incorrect value for expiry, must be in format "<amount><units>"');
    }
    const { packages } = data_1.getData();
    // If already installed, remove it so that it can be updated
    const pAlready = packages.findIndex(p => p.name === pkgName);
    if (pAlready >= 0) {
        packages.splice(pAlready, 1);
    }
    console.log(`Installing "${pkgName}"`);
    // Install the package
    const pkg = await installPackage(pkgName, expiry);
    // Add the package to the packages list and save it
    packages.push(pkg);
    data_1.setSingleData('packages', packages);
    console.log(`Package "${pkgName}" was successfully installed.`);
}
exports.run = run;
async function installPackage(pkgName, expiry) {
    const pkg = {
        expiry: expiry || undefined,
        installed: moment_1.default().toISOString(),
        name: pkgName,
    };
    const { package_manager } = data_1.getData();
    if (package_manager === 'npm') {
        await utils_1.getAsync(`npm install ${pkgName} -g`);
    }
    else if (package_manager === 'yarn') {
        await utils_1.getAsync(`sudo yarn global add ${pkgName}`);
    }
    return pkg;
}
