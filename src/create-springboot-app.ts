import * as fs from 'fs-extra';
import * as path from 'path';
import * as process from 'process';

const createSpringbootApp = async (name: string) => {
  const templateDir = "./template";  // テンプレートのディレクトリへのパスを指定します
  const newProjectDir = path.join(process.cwd(), name);

  await fs.ensureDir(newProjectDir);
  await fs.copy(templateDir, newProjectDir);
};

const projectName = process.argv[2];
createSpringbootApp(projectName).catch(error => {
  console.error(error);
  process.exit(1);
});
