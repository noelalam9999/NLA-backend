import bcrypt from "bcryptjs";

const users = [
  {
    username: "tayyab",
    password: bcrypt.hashSync("asdfg123", 10),
  },
  {
    username: "hamza",
    password: bcrypt.hashSync("asdfg", 10),
  },
  {
    username: "neol",
    password: bcrypt.hashSync("123", 10),
  },
];

export default users;
