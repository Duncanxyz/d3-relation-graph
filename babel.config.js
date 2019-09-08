module.exports = {
  plugins: ['@babel/plugin-proposal-class-properties'],
  presets: [
    [
      '@babel/preset-env',
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
  comments: false
}
