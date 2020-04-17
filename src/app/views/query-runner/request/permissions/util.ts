import { IPermission } from '../../../../../types/permissions';

export function generatePermissionGroups(permissions: any) {
    const map = new Map();
    const groups: any[] = [];

    let isCollapsed = false;
    let previousCount = 0;
    let count = 0;

    for (const permission of permissions) {
        const permissionValue = permission.value;
        const groupName = permissionValue.split('.')[0];
        if (!map.has(groupName)) {
            map.set(groupName, true);
            count = permissions.filter(
                (perm: IPermission) => {
                    const value = perm.value.split('.')[0];
                    return value  === groupName;
                }
            ).length;
            if (groups.length > 0) {
                isCollapsed = true;
            }
            groups.push({
                name: groupName,
                key: groupName,
                startIndex: previousCount,
                isCollapsed,
                count,
            });
            previousCount += count;
        }
    }

    return groups;
}