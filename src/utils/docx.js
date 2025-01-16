import { Document, Paragraph, AlignmentType, BorderStyle, TextRun, Table, TableCell, TableRow, ImageRun, WidthType } from 'docx';
import { COMPACT_SENSITIVITY_MITIGATIONS_RANK_THRESHOLD_LTEQ, DOCX_DOCUMENT_CONTENT} from 'utils/config';
import { getColorFromScore } from 'utils/severity';
import { _ } from 'services/i18n';


const STYLES = {
    colors: {
        primary: '00a297',
        secondary: '182c3d',
        border: 'cbcbcb'
    },
    font: {
        small: 20,
        normal: 24,
        large: 30,
        xlarge: 40
    },
    spacing: {
        small: 100,
        medium: 200,
        large: 400,
        xlarge: 600
    },
    table: {
        default: {
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
                top: { style: BorderStyle.SINGLE, size: 5, color: 'cbcbcb' },
                bottom: { style: BorderStyle.SINGLE, size: 5, color: 'cbcbcb' },
                right: { style: BorderStyle.SINGLE, size: 5, color: 'cbcbcb' },
                left: {
                    style: BorderStyle.SINGLE,
                    size: 16,
                    color: '00a297',
                    space: 10
                },
                insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
            },
            margins: {
                left: 300,
                right: 300,
                top: 100,
                bottom: 100
            },
            spacing: {
                before: 0,
                after: 0
            }
        }
    }
};

const createTextRun = (text, style = {}) => new TextRun({
    text,
    size: style.size || STYLES.font.normal,
    bold: style.bold || false,
    italics: style.italics || false,
    underline: style.underline || false,
    color: style.color || STYLES.colors.secondary
});

const createStyledParagraph = (text, config = {}) => new Paragraph({
    children: [createTextRun(text, config.style)],
    alignment: config.alignment || AlignmentType.JUSTIFIED,
    spacing: {
        before: config.spacing?.before || STYLES.spacing.small,
        after: config.spacing?.after || STYLES.spacing.small
    },
    border: config.border,
    ...config.paragraphProps
});

const createTableCell = (children, colSpan = 1) => new TableCell({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnSpan: Array.isArray(children) ? colSpan : colSpan + 2,
    children: Array.isArray(children) ? children : [children]
});

const createTableRow = (cells) => new TableRow({
    children: cells.map((cell) =>
        createTableCell(cell)
    )
});

const createTable = (rows, style = STYLES.table.default, columnWidths = ['10466']) => new Table({
    ...style,
    columnWidths: columnWidths,
    rows: rows.map(row => createTableRow(row))
});

export const DocxCreateDocument = (childrens) => {
    return new Document({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: 720,
                        right: 720,
                        bottom: 720,
                        left: 720
                    },
                    size: {
                        width: 11906,
                        height: 16838
                    }
                }
            },
            children: childrens
        }]
    });
};

export const DocxHeader = (logo, title, surveyType) => [
    new Paragraph({
        children: [
            new ImageRun({
                data: logo,
                transformation: {
                    width: 200,
                    height: 30
                },
                floating: {
                    horizontalPosition: {
                        relative: 'margin',
                        align: 'left'
                    },
                    verticalPosition: {
                        relative: 'margin',
                        align: 'top',
                    },
                }
            }),

            new TextRun({
                text: _(title),
                size: STYLES.font.xlarge,
                bold: true,
                color: STYLES.colors.secondary
            })

        ],
        alignment: AlignmentType.CENTER,
    }),

    new Paragraph({
        children: [],
        border: {
            bottom: {
                style: BorderStyle.SINGLE,
                size: 5,
                color: STYLES.colors.border
            }
        },
        spacing: {
            before: STYLES.spacing.medium,
            after: STYLES.spacing.large
        }
    }),
    createStyledParagraph(_(surveyType), {
        style: { size: STYLES.font.large, bold: true },
        alignment: AlignmentType.CENTER,
        spacing: {
            before: STYLES.spacing.medium,
            after: STYLES.spacing.medium
        }
    })
];

export const DocxExperimentalNote = (experimentalNote) =>
    createStyledParagraph(experimentalNote, {
        style: {
            size: STYLES.font.small,
            italics: true
        },
        alignment: AlignmentType.RIGHT,
        spacing: {
            before: STYLES.spacing.large,
            after: STYLES.spacing.large
        }
    });

export const DocxIntroductionCompact = (description, heading, isSensModule) => [
    createStyledParagraph(_(description), {
        spacing: {
            before: STYLES.spacing.large,
            after: STYLES.spacing.large
        },
    }),
    createStyledParagraph(_(heading), {
        style: {
            size: STYLES.font.large,
            bold: true,
            color: STYLES.colors.primary
        },
        spacing: {
            before: STYLES.spacing.medium,
            after: STYLES.spacing.large
        }
    }),
    ...(!isSensModule ? [createStyledParagraph(_('Sensitivity statements'), {
        style: { size: STYLES.font.large, bold: true },
        spacing: { after: STYLES.spacing.large }
    })] : [])
];

export const DocxCreateBlockCompact = ({
    title,
    description,
    items = {},
    mitigationsTitle,
    opportunitiesTitle,
    mitigationsEmptyMessage,
    opportunitiesEmptyMessage,
    isSensModule = false,
    isHighPrioritySection = false
}) => {

    const DocxListItems = (items = [], emptyMessage, isSensModule = false) => {
        const filterItems = (items) => {
            if (!Array.isArray(items)) return [];
            return isSensModule
                ? items.filter(item =>
                    item?.rank <= COMPACT_SENSITIVITY_MITIGATIONS_RANK_THRESHOLD_LTEQ &&
                    item.title?.trim().length > 0)
                : items.filter(item => item?.trim?.().length > 0);
        };

        const filteredItems = filterItems(items);

        if (filteredItems.length === 0) {
            return [createStyledParagraph(emptyMessage, {
                style: { size: STYLES.font.small },
            })];
        }

        return filteredItems.map(item => createStyledParagraph(
            isSensModule ? item.title.trim() : item.trim(), {
                style: { size: STYLES.font.small },
                paragraphProps: { bullet: { level: 0 } }
            }
        ));
    };

    const createSectionTitle = () => {
        const titleContent = createStyledParagraph(_(title), {
            style: {
                size: STYLES.font.normal,
                bold: isSensModule,
            }
        });

        return isHighPrioritySection
            ? createTable([[titleContent]])
            : createStyledParagraph(_(title), {
                style: {
                    size: STYLES.font.normal,
                    bold: true
                },
                spacing: {
                    before: STYLES.spacing.large,
                    after: STYLES.spacing.medium
                }
            });
    };

    const createContentTable = () => createTable([
        [
            createStyledParagraph(_(mitigationsTitle), {
                style: {
                    size: STYLES.font.normal,
                    bold: true,
                    color: STYLES.colors.primary
                },
                spacing: {
                    before: STYLES.spacing.medium,
                    after: STYLES.spacing.small
                }
            })
        ],
        ...DocxListItems(items?.mitigations, mitigationsEmptyMessage, isSensModule)
            .map(item => [item]),

        [
            createStyledParagraph(_(opportunitiesTitle), {
                style: {
                    size: STYLES.font.normal,
                    bold: true,
                    color: STYLES.colors.primary
                },
                spacing: {
                    before: STYLES.spacing.medium,
                    after: STYLES.spacing.small
                }
            })
        ],
        ...DocxListItems(items?.opportunities, opportunitiesEmptyMessage, isSensModule)
            .map(item => [item])
    ], STYLES.table.default);

    return [
        createSectionTitle(),
        description && createStyledParagraph(_(description), {
            style: { size: STYLES.font.normal },
            spacing: {
                before: STYLES.spacing.small,
                after: STYLES.spacing.medium
            }
        }),
        (!isHighPrioritySection || isSensModule) && createContentTable(),
        isSensModule && createStyledParagraph('', {
            spacing: {
                before: STYLES.spacing.medium,
                after: STYLES.spacing.medium
            }
        })
    ].filter(Boolean);
};

export const DocxIntroductionDetailed = (title, description, severityCounts) => [
    createStyledParagraph(_(title), {
        spacing: {
            before: STYLES.spacing.large,
            after: STYLES.spacing.large
        },
        style: { size: STYLES.font.large, bold: true }
    }),

    createTable(
        [
            [
                ...severityCounts.map(({ severity, count, color }) => [
                    createStyledParagraph(_(`${count} ${severity} Concerns`), {
                        style: {
                            color: color.split('#')[1],
                            bold: true
                        },
                        spacing: {
                            before: 0,
                            after: 0
                        },
                        alignment: AlignmentType.CENTER
                    })
                ])
            ],
            [
                createStyledParagraph(_(description), {
                    spacing: {
                        before: STYLES.spacing.large,
                        after: STYLES.spacing.large
                    },
                })
            ]            
        ],
        {
            ...STYLES.table.default,
            borders: {
                ...STYLES.table.default.borders,
                left: { style: BorderStyle.SINGLE, size: 5, color: STYLES.colors.border },
                insideVertical: { style: BorderStyle.SINGLE, size: 5, color: STYLES.colors.border },
                insideHorizontal: { style: BorderStyle.SINGLE,  size: 5, color: STYLES.colors.border }
            }
        },
        [3488.66, 3488.66, 3488.66]
    ),
];

export const DocxCreateTableStatementDetailed = (statementData) => {
    return [
        createStyledParagraph(_('STATEMENTS'), {
            style: { size: STYLES.font.large, bold: true },
            spacing: {
                before: STYLES.spacing.xlarge,
                after: STYLES.spacing.large
            }
        }),

        ...statementData.flatMap(statement => [
            createTable(
                [
                    [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: _(`${statement.severity.toUpperCase()} CONCERN`),
                                    size: STYLES.font.normal,
                                    bold: true,
                                    color: getColorFromScore(statement.score).split('#')[1],
                                }),
                            ],
                            spacing: {
                                after: 0,
                                before: 0,
                            }
                        }),
                    ],
                    [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: _(statement.statement?.title),
                                    size: STYLES.font.normal,
                                    color: STYLES.colors.secondary,
                                }),
                                statement.statement?.isExperimental ?
                                    new TextRun({
                                        text: _(DOCX_DOCUMENT_CONTENT.EXPERIMENTAL_NOTE),
                                        size: STYLES.font.small,
                                        color: STYLES.colors.secondary,
                                        italics: true,
                                        break: 2
                                    }): [],
                            ],
                            alignment: AlignmentType.JUSTIFIED,                                
                        }),
                    ],
                    statement.statement?.hints && [  
                        createStyledParagraph(_('ADDITIONAL INFORMATION'), {
                            style: { 
                                bold: true, 
                                color: STYLES.colors.primary 
                            },
                            spacing: {
                                after: 0,
                                before: STYLES.spacing.medium,
                            }
                        })
                    ],
                    statement.statement?.hints && [
                        createStyledParagraph(_(statement.statement?.hints), {
                            spacing: {
                                after: STYLES.spacing.medium
                            }
                        })
                    ],

                    [
                        createStyledParagraph(_('MITIGATIONS'), {
                            style: { bold: true, color: STYLES.colors.primary },
                            spacing: {
                                after: 0,
                                before: STYLES.spacing.medium,
                            }
                        })
                    ],
                    ...statement.statement?.mitigations?.length > 0 ?
                        statement.statement.mitigations
                            .filter(mitigation => mitigation?.title.trim() !== '')
                            .map(mitigation => [
                                createStyledParagraph(_(mitigation.title), {
                                    paragraphProps: { bullet: { level: 0 } },
                                    spacing: {
                                        after: 0,
                                        before: 0
                                    }
                                })
                            ]) :
                        [
                            createStyledParagraph(DOCX_DOCUMENT_CONTENT.EMPTY_STATES.MITIGATIONS, {
                                style: { size: STYLES.font.normal },
                            })
                        ],

                    [
                        createStyledParagraph(_('OPPORTUNITIES'), {
                            style: { bold: true, color: STYLES.colors.primary },
                            spacing: {
                                after: 0,
                                before: STYLES.spacing.medium,  
                            }
                        }),
                    ],
                    ...statement.statement?.opportunities?.length > 0 ?
                        statement.statement.opportunities
                            .filter(opportunity => opportunity.title.trim() !== '')
                            .map(opportunity => [
                                createStyledParagraph(_(opportunity.title), {
                                    paragraphProps: { bullet: { level: 0 } },
                                    spacing: {
                                        after: 0,
                                        before: 0
                                    }
                                })
                            ]):
                        [
                            createStyledParagraph(DOCX_DOCUMENT_CONTENT.EMPTY_STATES.OPPORTUNITIES, {
                                style: { size: STYLES.font.normal },
                            })
                        ]
                ],
                {
                    ...STYLES.table.default,
                    borders: {
                        ...STYLES.table.default.borders,
                        left: { 
                            ...STYLES.table.default.borders.left,
                            color: getColorFromScore(statement.score).split('#')[1]
                        }
                    }
                },
                [3488.66]
            ),
            createStyledParagraph('', {
                spacing: {
                    before: STYLES.spacing.normal,
                    after: STYLES.spacing.normal
                }
            }),
        ]),
    ];
};
