import { User } from "../types/types";
// 数组，其中的每个元素都是 User 类型。users 数组中的每个元素都应该是一个包含 username 和 password 字段的对象。
const users: User[] = [];
const addUser = (newUser: User) => {
  users.push(newUser);
};
const getUser = (user: User) => {
  return users.find(
    (u) => u.username === user.username && u.password === user.password
  );
};
export { addUser,getUser };