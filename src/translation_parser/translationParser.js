// Parses .yaml translations into .json
// Usage : yarn translations [FILES_TO_TRANSLATE|optional]
// Example : yarn translations en fr --> will translate only en.yaml and fr.yaml, if they exist
// If no argument is specified, all .yaml files with a valid name will be translated

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const args = process.argv.slice(2);
const inputDir = path.join(__dirname, 'translations');
const outputDir = path.join(__dirname, '..', 'renderer', 'src', 'translations');

let fileCount = 0;

try {
    fs.readdirSync(inputDir)
        .filter((fileName) => {
            const fileNameWithoutExtension = fileName.split('.')[0];
            const matchesName = 0 < args.length ? args.includes(fileNameWithoutExtension) : true;

            return /^[a-z_\-]+.yaml$/.test(fileName) && matchesName;
        })
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
