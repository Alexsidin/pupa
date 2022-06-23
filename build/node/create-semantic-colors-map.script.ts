import { SemanticColor } from '../../projects/kit/src/internal/declarations/classes/semantic-color.class';
import { SemanticColorsConfig } from '../../projects/kit/src/internal/declarations/interfaces/semantic-colors-config.interface';
import { readFile, writeFile } from 'fs/promises';

async function writeContentToFile(fileData: string): Promise<void> {
  await writeFile('./projects/kit/src/styles/maps/semantic-colors.map.scss', fileData, null);
}

async function getSemanticColorsMapScssFileContent(): Promise<string> {
  return await readFile('./projects/kit/src/assets/configs/semantic-colors-config.json', { encoding: 'utf8' })
    .then((content: string) => JSON.parse(content))
    .then((groups: SemanticColorsConfig.Group[]) => {
      const lightColors: string[] = [];
      const darkColors: string[] = [];

      const lightAlphaColors: string[] = [];
      const darkAlphaColors: string[] = [];

      for (const group of groups) {
        for (const configuration of group.configurations) {
          const semanticColor: SemanticColor = new SemanticColor(configuration, group.name);

          lightColors.push(`'${semanticColor.lightColor.name}': var(--color_${semanticColor.lightColor.value})`);
          darkColors.push(`'${semanticColor.darkColor.name}': var(--color_${semanticColor.darkColor.value})`);

          lightAlphaColors.push(
            `'${semanticColor.lightAlphaColor.name}': var(--${semanticColor.lightAlphaColor.value})`
          );
          darkAlphaColors.push(`'${semanticColor.darkAlphaColor.name}': var(--${semanticColor.darkAlphaColor.value})`);
        }
      }

      const emptyFileContent: string =
        '/** @file Automatically generated by create-semantic-colors-map.script.ts. Edit semantic-colors-config.json */';

      return `${emptyFileContent}\n
$lightColorsMap: (\n  ${lightColors.join(',\n  ')},\n);\n
$darkColorsMap: (\n  ${darkColors.join(',\n  ')},\n);\n
$lightColorsAlphaMap: (\n  ${lightAlphaColors.join(',\n  ')},\n);\n
$darkColorsAlphaMap: (\n  ${darkAlphaColors.join(',\n  ')},\n);\n`;
    });
}

Promise.resolve()
  .then(() => getSemanticColorsMapScssFileContent())
  .then((fileData: string) => writeContentToFile(fileData));
