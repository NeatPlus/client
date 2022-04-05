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

export const weightagePermissions = [
    'summary.add_optionstatement',
    'summary.change_optionstatement',
    'summary.delete_optionstatement',
    'summary.add_questionstatement',
    'summary.change_questionstatement',
    'summary.delete_questionstatement',
    'summary.add_statement',
    'summary.change_statement',
    'summary.delete_statement',
];
