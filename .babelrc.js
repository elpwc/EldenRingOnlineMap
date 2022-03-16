const presets = [
    [
        "@babel/env",
        {
            targets: '> 0.25% in CN, not dead'
        }
    ],
    [
        "@babel/typescript",
        {
            allowNamespaces: true
        }
    ]
];
const plugins = [[
    "@babel/plugin-transform-runtime",
    {
        corejs: {
            version: 3,
            proposals: true,
        }
    }
]];

module.exports = { presets, plugins };
