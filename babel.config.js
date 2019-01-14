module.exports = {
    presets: [
        [
            '@babel/env',
            {
                targets: {
                    ie: 11
                },
                modules: false
            }
        ],
        [
            'minify',
            {
                keepFnName: true,
                keepClassName: true
            }
        ]
    ],
    plugins: ['@babel/plugin-proposal-class-properties'],
    comments: false
};
