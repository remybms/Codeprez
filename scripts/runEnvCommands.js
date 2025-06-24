import { spawn } from "child_process";
import path from "path";

function runCommand(command, args = []) {
  const envDir = path.join(process.cwd(), "presentation", "env");

  const child = spawn(command, args, {
    cwd: envDir,
    shell: true,
  });

  console.log(`Executing: ${command} ${args.join(" ")}\n(in ${envDir})\n`);

  child.stdout.on("data", (data) => {
    process.stdout.write(`stdout: ${data}`);
  });

  child.stderr.on("data", (data) => {
    process.stderr.write(`stderr: ${data}`);
  });

  child.on("close", (code) => {
    console.log(`\n Command exited with code ${code}`);
  });

  child.on("error", (err) => {
    console.error("Failed to start process:", err);
  });
}

const input = process.argv.slice(2);
if (input.length === 0) {
  console.log("Usage: node runCommand.js <commande> [arguments]");
  process.exit(1);
}

const [command, ...args] = input;
runCommand(command, args);
