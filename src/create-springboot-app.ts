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
    rl.question("What version of Spring Boot do you want to use? -> ", resolve);
  });

  const getJavaVersion = async () => {
    const javaVersions = ["20", "17", "11", "8"];
    while (true) {
      const answer = await new Promise<string>(resolve => {
        rl.question(`What version of Java do you want to use? Choose from [${javaVersions.join(", ")}] -> `, resolve);
      });
      if (javaVersions.includes(answer)) {
        return answer;
      } else {
        console.log(`${answer} is invalid input. Please choose from [${javaVersions.join(", ")}].`);
      }
    }  
  }
  const javaVersion = await getJavaVersion();

  rl.close();

  const buildGradlePath = path.join(newProjectDir, 'build.gradle');
  const buildGradleContent = await fs.readFile(buildGradlePath, 'utf8');
  const replacedContent = buildGradleContent.replace("springBootVersion", springBootVersion)
                                            .replace("javaVersion", javaVersion);

  await fs.writeFile(buildGradlePath, replacedContent);
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
