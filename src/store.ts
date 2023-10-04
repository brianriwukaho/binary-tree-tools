import { writable } from "svelte/store";
import { TreeNode } from "./lib/tree.helpers";

export const treeDefinitionStore = writable<TreeNode>(new TreeNode(1));
