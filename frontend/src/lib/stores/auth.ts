import { writable } from "svelte/store";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const user =
  writable<User | null>(
    null
  );