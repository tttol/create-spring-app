import * as fs from 'fs-extra';
import * as path from 'path';
import * as process from 'process';
import * as readline from 'readline';

const createSpringApp = async (name: string) => {
  const templateDir :string = "./template/gradle-groovy";
  const destDir :string = path.join(process.cwd(), name);

  await fs.ensureDir(destDir);
  await fs.copy(templateDir, destDir);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const springBootVersion = await new Promise<string>(resolve => {
    rl.question("Tell me SpringBoot version -> ", resolve);
  });

  const getJavaVersion = async () => {
    const javaVersions = ["20", "17", "11", "8"];
    while (true) {
      const answer = await new Promise<string>(resolve => {
        rl.question(`Choose from Java version[${javaVersions.join(", ")}] -> `, resolve);
      });
      if (javaVersions.includes(answer)) {
        return answer;
      } 

      console.log(`${answer} is invalid input. Please choose from [${javaVersions.join(", ")}].`);
    }  
  }
  const javaVersion = await getJavaVersion();

  const group :string = await new Promise<string>(resolve => {
    rl.question("Group -> ", resolve);
  });
  const artifact :string = await new Promise<string>(resolve => {
    rl.question("Artifact -> ", resolve);
  });

  rl.close();

  const buildGradlePath = path.join(destDir, 'build.gradle');
  const buildGradleContent = await fs.readFile(buildGradlePath, 'utf8');
  const replacedContent = buildGradleContent.replace("springBootVersion", springBootVersion)
                                            .replace("javaVersion", javaVersion);
  await fs.writeFile(buildGradlePath, replacedContent);

  const applicationDir :string = destDir + "/src/main/java/" + group.replaceAll(".", "/") + "/" + artifact;
  fs.mkdir(applicationDir, {recursive: true}, (err)  => {if(err) throw err});
  
};

const projectName :string = process.argv[2];
if (!projectName) {
  console.error("You must set project name at arg.")
  console.error("Usage `create-spring-app <project name>`")
  process.exit(1)
}

createSpringApp(projectName).catch(error => {
  console.error(error);
  process.exit(1);
});
