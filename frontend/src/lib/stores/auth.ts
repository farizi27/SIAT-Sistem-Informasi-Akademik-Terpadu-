import { writable } from "svelte/store";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const isBrowser = typeof window !== "undefined";
const storedUser = isBrowser ? localStorage.getItem("user") : null;

export const user = writable<User | null>(
  storedUser ? JSON.parse(storedUser) : null
);