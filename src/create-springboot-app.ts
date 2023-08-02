import * as fs from 'fs-extra';
import * as path from 'path';
import * as process from 'process';
import * as readline from 'readline';

const createSpringbootApp = async (name: string) => {
  const templateDir = "./template";
  const newProjectDir = path.join(process.cwd(), name);

  await fs.ensureDir(newProjectDir);
  await fs.copy(templateDir, newProjectDir);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const springBootVersion = await new Promise<string>(resolve => {
    rl.question("What version of Spring Boot do you want to use? ", resolve);
  });

  const javaVersion = await new Promise<string>(resolve => {
    rl.question("What version of Java do you want to use? ", resolve);
  });

  rl.close();

  const buildGradlePath = path.join(newProjectDir, 'build.gradle');
  let buildGradleContent = await fs.readFile(buildGradlePath, 'utf8');

  buildGradleContent = buildGradleContent.replace(/id 'org.springframework.boot' version '\d+\.\d+\.\d+'/, `id 'org.springframework.boot' version '${springBootVersion}'`);
  buildGradleContent = buildGradleContent.replace(/sourceCompatibility = '\d+'/g, `sourceCompatibility = '${javaVersion}'`);

  await fs.writeFile(buildGradlePath, buildGradleContent);
};

const projectName = process.argv[2];
if (!projectName) {
  console.error("You must set project name at arg.")
  console.error("Usage `create-springboot-app <project name>`")
  process.exit(1)
}

createSpringbootApp(projectName).catch(error => {
  console.error(error);
  process.exit(1);
});
