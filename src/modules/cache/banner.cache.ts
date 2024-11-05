import localforage from 'localforage';
import { BANNER_IS_VISIBLE } from '../../app/services/graph-constants';

const bannerStorage = localforage.createInstance({
    storeName: 'banner',
    name: 'GE_V4'
});

export const bannerCache = (function () {
    const get = async (): Promise<Boolean> =>{
        return await bannerStorage.getItem(BANNER_IS_VISIBLE) as Boolean
    }
    const read = async (): Promise<Boolean | undefined | null> =>{
        return await bannerStorage.getItem(BANNER_IS_VISIBLE)
    }
    const update = async (value: Boolean) =>{
        await bannerStorage.setItem(BANNER_IS_VISIBLE, value.toString())
    }
    return { get,read, update}
})();
