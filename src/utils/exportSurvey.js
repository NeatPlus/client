import { DocxCreateDocument, DocxHeader, DocxIntroductionCompact, DocxCreateBlockCompact, DocxExperimentalNote, DocxIntroductionDetailed, DocxCreateTableStatementDetailed } from './docx';
import { DOCX_DOCUMENT_CONTENT } from './config';
import { getSeverityCounts } from 'utils/severity';

export default function createDocxDocumentForSurveyCompact(
    survey = {},
    statements = [],
    insights = {},
    activeModule
) {

    const isSensModule = activeModule?.code === 'sens';
    const hasExperimentalNote = (statements || [])
        .some(item => item?.statement?.isExperimental);

    const createSection = (
        title = '',
        description = '',
        mitigationsTitle,
        mitigationsEmptyMessage,
        opportunitiesTitle,
        opportunitiesEmptyMessage,
        items = {},
        isSensModule = false,
        isHighPrioritySection = false
    ) => DocxCreateBlockCompact({
        title,
        description,
        mitigationsTitle,
        mitigationsEmptyMessage,
        opportunitiesTitle,
        opportunitiesEmptyMessage,
        items: {
            mitigations: items.mitigations || [],
            opportunities: items.opportunities || []
        },
        isSensModule,
        isHighPrioritySection
    });

    const createHighPrioritySection = (statement, isSensModule) => createSection(
        statement.title,
        null,
        DOCX_DOCUMENT_CONTENT.HEADINGS.HIGH_PRIORITY_MITIGATIONS,
        DOCX_DOCUMENT_CONTENT.EMPTY_STATES.MITIGATIONS,
        DOCX_DOCUMENT_CONTENT.HEADINGS.HIGH_PRIORITY_OPPORTUNITIES,
        DOCX_DOCUMENT_CONTENT.EMPTY_STATES.OPPORTUNITIES,
        {
            mitigations: statement.mitigations || [],
            opportunities: statement.opportunities || []
        },
        isSensModule,
        true
    );

    const createHighestRankSection = (insights = {}) => createSection(
        DOCX_DOCUMENT_CONTENT.HEADINGS.HIGHEST_RANK,
        DOCX_DOCUMENT_CONTENT.SECTIONS.HIGHEST_RANK_DESCRIPTION,
        DOCX_DOCUMENT_CONTENT.HEADINGS.HIGHEST_RANK_MITIGATIONS,
        DOCX_DOCUMENT_CONTENT.EMPTY_STATES.MITIGATIONS,
        DOCX_DOCUMENT_CONTENT.HEADINGS.HIGHEST_RANK_OPPORTUNITIES,
        DOCX_DOCUMENT_CONTENT.EMPTY_STATES.OPPORTUNITIES,
        {
            mitigations: insights.mitigations?.important || [],
            opportunities: insights.opportunities?.important || []
        }
    );

    const createRecurringSection = (insights = {}) => createSection(
        DOCX_DOCUMENT_CONTENT.HEADINGS.RECURRING,
        DOCX_DOCUMENT_CONTENT.SECTIONS.RECURRING_DESCRIPTION,
        DOCX_DOCUMENT_CONTENT.HEADINGS.RECURRING_MITIGATIONS,
        DOCX_DOCUMENT_CONTENT.EMPTY_STATES.MITIGATIONS,
        DOCX_DOCUMENT_CONTENT.HEADINGS.RECURRING_OPPORTUNITIES,
        DOCX_DOCUMENT_CONTENT.EMPTY_STATES.OPPORTUNITIES,
        {
            mitigations: insights.mitigations?.repeated || [],
            opportunities: insights.opportunities?.repeated || []
        }
    );

    return DocxCreateDocument(
        [
            ...DocxHeader(
                DOCX_DOCUMENT_CONTENT.LOGO_BASE64,
                survey.title || '',
                activeModule?.title || ''
            ),
            ...DocxIntroductionCompact(
                DOCX_DOCUMENT_CONTENT.SECTIONS.HIGH_PRIORITY_DESCRIPTION,
                DOCX_DOCUMENT_CONTENT.SECTIONS.HIGH_PRIORITY_HEADING,
                isSensModule
            ),
            ...statements.flatMap(statement =>
                createHighPrioritySection(statement?.statement, isSensModule)
            ),
            ...(!isSensModule ? [
                ...createHighestRankSection(insights),
                ...createRecurringSection(insights)
            ] : []),
            hasExperimentalNote && DocxExperimentalNote(DOCX_DOCUMENT_CONTENT.EXPERIMENTAL_NOTE_FOOTER)
        ].filter(Boolean)
    );
}

export function createDocxDocumentForSurveyDetailed(
    topicsWithStatementsData,
    activeSurvey,
    activeModule
) {

    return DocxCreateDocument(
        [
            ...DocxHeader(
                DOCX_DOCUMENT_CONTENT.LOGO_BASE64,
                activeSurvey?.title || '',
                activeModule?.title || ''
            ),

            ...topicsWithStatementsData.flatMap((topic) => [
                ...DocxIntroductionDetailed(
                    topic?.title || '',
                    topic?.description || '',
                    getSeverityCounts(topic.statementData)
                ),
                ...DocxCreateTableStatementDetailed(
                    topic?.statementData
                ),
            ]),
            DocxExperimentalNote(DOCX_DOCUMENT_CONTENT.EXPERIMENTAL_NOTE_FOOTER)
        ]
    );
}
