import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

const COOKIE_KEY = "course-review-cookie";

export function getOrSetUID(): string {
  let uid = Cookies.get(COOKIE_KEY);
  if (!uid) {
    uid = uuidv4();
    Cookies.set(COOKIE_KEY, uid, { expires: 10000 });
  }
  return uid;
}
