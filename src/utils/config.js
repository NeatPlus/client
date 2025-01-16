import { _ } from 'services/i18n';

export const AVAILABLE_SURVEY_MODULES = [
    'sens',
    'shelter',
    'wash',
    'fs',
    'live',
];

export const COMPACT_SENSITIVITY_MITIGATIONS_RANK_THRESHOLD_LTEQ = 4;

export const MAX_NUM_COMPACT_SENSITIVITY_STATEMENTS = 12;
export const MAX_NUM_COMPACT_ACTIVITY_STATEMENTS = 12;

export const DOCX_DOCUMENT_CONTENT = {
    LOGO_BASE64: 'data:image/png;base64,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',
    SECTIONS: {
        HIGH_PRIORITY_DESCRIPTION: _('The following report summarises only the highest priority sensitivities, mitigations and opportunities identified in response to your U-NEAT assessment answers.'),
        HIGH_PRIORITY_HEADING: _('Highest priority sensitivity statements, mitigations and opportunities'),
        HIGHEST_RANK_DESCRIPTION: _('The following are the highest ranked mitigations addressing the most significant Sensitivities identified in response to your U-NEAT+ assessment questions. Mitigations all relate to actions that can be undertaken by humanitarian responders. Most of these can be enacted in the field, whilst some should be referred to your regional or head office for action. Opportunities are all actions that you can put in place to support or enable development actions undertaken by others. You should view the full report for a longer list of mitigations and opportunities to review in order to select those most relevant to your activities.'),
        RECURRING_DESCRIPTION: _('The following mitigations are not the highest priority, but they have been identified multiple times in response to your assessment answers. Please consider whether you can implement some of them in your response.')
    },
    HEADINGS: {
        HIGH_PRIORITY_MITIGATIONS: _('Highest priority mitigations'),
        HIGH_PRIORITY_OPPORTUNITIES: _('Highest priority opportunities'),
        RECURRING: _('Recurring Mitigations and Opportunities'),
        RECURRING_MITIGATIONS: _('HUMANITARIAN MITIGATIONS'),
        RECURRING_OPPORTUNITIES: _('DEVELOPMENT OPPORTUNITIES'),
        HIGHEST_RANK: _('Highest Ranked Mitigations and Opportunities'),
        HIGHEST_RANK_MITIGATIONS: _('Highest priority humanitarian mitigations'),
        HIGHEST_RANK_OPPORTUNITIES: _('Highest priority potential development opportunities')
    },
    EMPTY_STATES: {
        MITIGATIONS: _('No mitigations data found!'),
        OPPORTUNITIES: _('No opportunities data found!')
    },
    EXPERIMENTAL_NOTE: _('* This concern level of this statement might vary by context.'),
    EXPERIMENTAL_NOTE_FOOTER: _(' * The concern levels of statements with ℹ might vary by contex.')
};
