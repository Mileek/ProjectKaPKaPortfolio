const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'src/assets/logo/';
const outputDirDesktop = 'src/assets/images/dynamic/desktop/';
const outputDirMobile = 'src/assets/images/dynamic/mobile/';
const outputDirSmallCustom = 'src/assets/logo/custom/';

// Ensure output directories exist
// if (!fs.existsSync(outputDirDesktop))
// {
//     fs.mkdirSync(outputDirDesktop, { recursive: true });
// }
// if (!fs.existsSync(outputDirMobile))
// {
//     fs.mkdirSync(outputDirMobile, { recursive: true });
// }
if (!fs.existsSync(outputDirSmallCustom))
{
    fs.mkdirSync(outputDirSmallCustom, { recursive: true });
}

fs.readdirSync(inputDir).forEach(file =>
{
    if (path.extname(file) === '.webp')
    {
        const inputFile = path.join(inputDir, file);
        const outputFileDesktop = path.join(outputDirDesktop, file);
        const outputFileMobile = path.join(outputDirMobile, file);
        const outputFileSmallCustomPath = path.join(outputDirSmallCustom, file);

        // Resize for desktop
        // sharp(inputFile)
        //     .resize(1920, 1080)
        //     .toFile(outputFileDesktop, (err, info) => {
        //         if (err) {
        //             console.error('Error resizing for desktop:', err);
        //         } else {
        //             console.log('Resized for desktop:', info);
        //         }
        //     });

        // Resize for mobile
        // sharp(inputFile)
        //     .resize(800, 600)
        //     .toFile(outputFileMobile, (err, info) => {
        //         if (err) {
        //             console.error('Error resizing for mobile:', err);
        //         } else {
        //             console.log('Resized for mobile:', info);
        //         }
        //     });

        // Resize for custom size
        sharp(inputFile)
            .resize(100, 100)
            .toFile(outputFileSmallCustomPath, (err, info) =>
            {
                if (err)
                {
                    console.error('Error resizing for custom size:', err);
                } else
                {
                    console.log('Resized for custom size:', info);
                }
            });
    }
});