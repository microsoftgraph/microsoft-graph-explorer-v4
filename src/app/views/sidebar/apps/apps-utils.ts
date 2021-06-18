import { IAppItem } from '../../../../types/rsc-apps';

let appStorage: IAppItem[] = [];

/**
 * To be able to write apps into the storage
 * @param appsItem the app we are to add that they can mimic in rsc
 */
export async function writeApps(appsItem: IAppItem) {
  appStorage = [...appStorage, appsItem];
}

export async function readApps(): Promise<IAppItem[]> {
  return appStorage;
}
