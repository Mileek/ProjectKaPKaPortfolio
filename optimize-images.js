(async () =>
{
    const imagemin = (await import('imagemin')).default;
    const imageminWebp = (await import('imagemin-webp')).default;
    const path = require('path');

    const files = await imagemin(['src/assets/images/custom/*.webp'], {
        destination: 'src/assets/images/custom',
        plugins: [
            imageminWebp({ quality: 50 })
        ]
    });

    console.log('Images optimized:', files);
})();