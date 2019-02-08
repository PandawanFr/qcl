import { IData, PackageManager } from './interfaces';
/**
 * Save the given data to the /qcl/data.json file
 */
export declare function setData(data: IData): Promise<void>;
/**
 * Get the data from the /qcl/data.json file
 */
export declare function getData(): Promise<IData>;
/**
 * Create a default data object
 */
export declare function defaultData(): IData;
export default function getPackageManager(): Promise<PackageManager>;