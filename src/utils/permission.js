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
    'statement.view_statement',
    'statement.add_statement',
    'statement.change_statement',
    'statement.delete_statement',

    'statement.view_questionstatement',
    'statement.add_questionstatement',
    'statement.change_questionstatement',
    'statement.delete_questionstatement',

    'statement.view_optionstatement',
    'statement.add_optionstatement',
    'statement.change_optionstatement',
    'statement.delete_optionstatement',

    'statement.view_statementformula',
    'statement.add_statementformula',
    'statement.change_statementformula',
    'statement.delete_statementformula',
];
