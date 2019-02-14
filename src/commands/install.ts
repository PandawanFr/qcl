import moment from 'moment';

import { getData, getPackageManager, setData } from '../universal/data';
import { Expiry, IPackage } from '../universal/interfaces';
import { getAsync, isValidDuration } from '../universal/utils';

/**
 * Installs the given package
 * @param pkgName The package to install
 */
export default async function install(
  pkgName: string,
  expiry: Expiry | undefined
) {
  if (!pkgName) {
    throw new Error('No package was given.');
  }

  if (
    expiry &&
    (expiry.length !== 2 || !isValidDuration(expiry[0], expiry[1]))
  ) {
    throw new Error(
      'Incorrect value for expiry, must be in format "number units"'
    );
  }

  const data = await getData();

  // If already installed, remove it so that it can be updated
  const pAlready = data.packages.findIndex(p => p.name === pkgName);
  if (pAlready >= 0) {
    data.packages.splice(pAlready, 1);
  }

  console.log(`Installing "${pkgName}"`);

  // Install the package
  const pkg = await installPackage(pkgName, expiry);

  // Add the package to the packages list and save it
  data.packages.push(pkg);
  await setData(data);

  console.log(`Package "${pkgName}" was successfully installed.`);
}

async function installPackage(
  pkgName: string,
  expiry: Expiry | undefined
): Promise<IPackage> {
  const pkg: IPackage = {
    expiry: expiry || undefined,
    installed: moment().toISOString(),
    name: pkgName,
  };

  // TODO: Maybe make this cleaner using a separate class?
  const pkgManager = await getPackageManager();
  if (pkgManager === 'npm') {
    // TODO: Allow for extra parameters such as --global and --saveDev
    console.log(await getAsync(`sudo npm install ${pkgName} -g`));
  } else if (pkgManager === 'yarn') {
    console.log(await getAsync(`sudo yarn global add ${pkgName}`));
  }
  return pkg;
}
