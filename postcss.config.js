const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
    plugins: [
        purgecss({
            content: [
                './src/**/*.html',
                './src/**/*.ts',
            ],
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
            safelist: {
                // Bezpieczne klasy Bootstrap
                standard: [
                    'row',
                    'col',
                    'col-12',
                    'col-md-4',
                    'col-md-6',
                    'form-field',
                    'form-error',
                    'input-text',
                    'container',
                    'container-fluid',
                ],
                // Klasy z prefiksami
                greedy: [
                    /^col-/,
                    /^form-/,
                    /^input-/,
                    /^btn-/,
                    /^active$/,
                    /^show$/,
                    /^collapsing$/,
                    /^carousel-/,
                    /^modal-/,
                ],
            },
        })
    ]
};
