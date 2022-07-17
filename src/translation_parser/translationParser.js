const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const inputDir = path.join(__dirname, 'translations');
const outputDir = path.join(__dirname, '..', 'renderer', 'src', 'translations');

let fileCount = 0;

try {
    fs.readdirSync(inputDir)
        .filter((v) => /^[a-z_\-]+.yaml$/.test(v))
        .forEach((fileName) => {
            const yamlTranslation = yaml.load(fs.readFileSync(path.join(inputDir, fileName), { encoding: 'utf-8' }));
            const fileNameWithoutExtension = fileName.split('.')[0];

            fs.writeFileSync(
                path.join(outputDir, `${fileNameWithoutExtension}.json`),
                JSON.stringify(yamlTranslation, null, 2)
            );

            fileCount++;
            console.info(`Wrote file "${fileNameWithoutExtension}.json".`);
        });

    console.info(`Success! Wrote ${fileCount} file${1 < fileCount ? 's' : ''}.`);
} catch (e) {
    console.error('Error : ', e, 'Cancelling...');
}
