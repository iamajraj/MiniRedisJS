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

function SET(rest: Array<String>) {
  let key = rest[0];
  let value = rest[1];

  if (!key || !value) {
    return console.log("To set a value key and value must be provided");
  }

  VALUES.set(key, value);
  console.log("value has been set");
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

const print_screen = () => {
  console.log(`
Welcome to not so Redis!
  
Commands -> 'set' | 'get' | 'delete'

To set a value,    type -> set key value
To get a value,    type -> get key
To delete a key, type -> delete key

`);
};
const process = (input: string) => {
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
};

const middleware = (input: string) => {
  if (input === "exit.") {
    console.log("Good to see you!");
    exit(0);
  }
};

const askForInput = () => {
  read.question("query-> ", (answer) => {
    middleware(answer);
    process(answer);
    askForInput();
  });
};

const main = () => {
  print_screen();
  askForInput();
};

main();
