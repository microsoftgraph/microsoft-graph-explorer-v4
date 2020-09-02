import { IPermission } from '../../../../../types/permissions';

export function generatePermissionGroups(permissions: any) {
    const map = new Map();
    const groups: any[] = [];

    const isCollapsed = true;
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
                    return value === groupName;
                }
            ).length;
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

export function setConsentedStatus(tokenPresent: any, permissions: IPermission[], consentedScopes: string[]) {
    if (tokenPresent) {
        permissions.forEach((permission: IPermission) => {
            if (consentedScopes.indexOf(permission.value) !== -1) {
                permission.consented = true;
            }
        });
    }
}