import { DurationInputArg2 } from 'moment';

export type Expiry = [number, DurationInputArg2];

export interface IPackage {
  /**
   * Name of the package installed
   */
  name: string;
  /**
   * Date of installation in ISO 8601 format
   */
  installed: string;

  expiry: Expiry | undefined;
}

export interface IData {
  /**
   * Which package manager to use to install packages.
   */
  package_manager: PackageManager;
  /**
   * List of all currently installed packages
   */
  packages: IPackage[];
  /**
   * How long should a package be preserved
   * Format: [number, 'unit']
   */
  expiry: Expiry;
}

export type PackageManager = 'npm' | 'yarn';
