const ACCESS_LEVELS = [
    'organization_admin', 
    'owner', 
    'write', 
    'read_only', 
    'visibility'
];

export const checkEditAccess = accessLevel => {
    const levelIdx = ACCESS_LEVELS.findIndex(el => el === accessLevel);
    if(levelIdx!==-1) {
        return levelIdx < 3;
    }
    return false;
};
