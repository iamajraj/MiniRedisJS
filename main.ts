import { existsSync, readFileSync, writeFileSync } from "fs";
import { exit, stdin, stdout } from "process";
import readline from "readline";

const read = readline.createInterface({
  input: stdin,
  output: stdout,
});

const OPERATIONS = ["set", "get", "delete"];
const H_OPERATIONS = new Map();

H_OPERATIONS.set("set", SET);
H_OPERATIONS.set("get", GET);
H_OPERATIONS.set("delete", DELETE);

const VALUES = new Map();

function take_snapshot() {
  let snapshots = "";
  VALUES.forEach((value, key) => {
    let key_values = `${key} ${value}\n`;
    snapshots += key_values;
  });
  writeFileSync(".snapshot", snapshots, "utf-8");
}

function load_snapshot() {
  if (existsSync(".snapshot")) {
    let snapshots = readFileSync(".snapshot", {
      encoding: "utf-8",
    });
    let lines = snapshots.split("\n");
    lines.forEach((line) => {
      let key_value = line.split(" ");
      let key = key_value[0];
      let value = key_value[1];
      VALUES.set(key, value);
    });
  }
}

function SET(rest: Array<String>) {
  let key = rest[0];
  let value = rest[1];

  if (!key || !value) {
    return console.log("To set a value key and value must be provided");
  }

  VALUES.set(key, value);
  console.log("value has been set");
  take_snapshot();
}

function GET(rest: Array<String>) {
  let key = rest[0];

  if (!key) {
    return console.log("To get the value key must be provided");
  }

  if (!VALUES.has(key)) {
    return console.log(`'${key}' <- key doesn't exist`);
  }

  console.log(VALUES.get(key));
}

function DELETE(rest: Array<String>) {
  let key = rest[0];

  if (!key) {
    return console.log("To delete, a key must be provided");
  }

  if (!VALUES.has(key)) {
    return console.log(`'${key}' <- key doesn't exist`);
  }
  VALUES.delete(key);
  console.log("key has been removed");
}

function print_screen() {
  console.log(`
Welcome to not so Redis!
  
Commands -> 'set' | 'get' | 'delete'

To set a value,    type -> set key value
To get a value,    type -> get key
To delete a key, type -> delete key

`);
}

function process(input: string) {
  let args = input.split(" ");

  if (args.length <= 0) {
    return console.log("!! NO OPERATION PROVIDED");
  }

  let operation = args[0];

  if (OPERATIONS.includes(operation)) {
    H_OPERATIONS.get(operation)(args.slice(1)); // <- provide the rest of the arguments
  } else {
    console.log("!! INVALID OPERATION");
  }
}

function middleware(input: string) {
  if (input === "exit.") {
    console.log("Good to see you!");
    exit(0);
  }
}

function askForInput() {
  read.question("query-> ", (answer) => {
    middleware(answer);
    process(answer);
    askForInput();
  });
}

function main() {
  load_snapshot();
  print_screen();
  askForInput();
}

main();
