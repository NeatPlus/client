module.exports = {
    componentPropsMap: {
        Localize: {
            one: 'msgid',
            many: 'msgid_plural',
            context: 'msgctxt',
            comment: 'comment',
        }
    },
    funcArgumentsMap: {
        _: ['msgid', 'msgid_plural', 'msgctxt'],
    },
    trim: true,
};
