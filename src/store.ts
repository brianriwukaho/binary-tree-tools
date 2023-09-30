import { writable } from "svelte/store";

export const treeDefinitionStore = writable<string>("[1]");
