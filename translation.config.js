module.exports = {
    componentPropsMap: {
        Localize: {
            text: 'msgid',
            textPlural: 'msgid_plural',
            textContext: 'msgctxt',
            comment: 'comment',
        }
    },
    funcArgumentsMap: {
        _: ['msgid', 'msgid_plural', 'msgctxt'],
    },
    trim: true,
};
