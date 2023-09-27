import * as d3 from "d3";

interface D3Node<T> {
  name: T;
  children?: D3Node<T>[] | undefined;
}

export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

export function convertToD3Node(root: TreeNode | null): D3Node<string> | null {
  if (!root) {
    return null;
  }

  const d3Node: D3Node<string> = {
    name: root.val.toString(),
  };

  const children: D3Node<string>[] = [];

  if (root.left) {
    children.push(convertToD3Node(root.left)!);
  }

  if (root.right) {
    children.push(convertToD3Node(root.right)!);
  }

  if (children.length) {
    d3Node.children = children;
  }

  return d3Node;
}

export function arrayToBinaryTree(nums: number[]): TreeNode | null {
  if (nums.length === 0) {
    return null;
  }

  const root = new TreeNode(nums[0]);
  const queue: TreeNode[] = [root];
  let isLeft: boolean = true;

  for (let i = 1; i < nums.length; i++) {
    const newNode = new TreeNode(nums[i]);

    if (isLeft) {
      queue[0].left = newNode;
    } else {
      queue[0].right = newNode;
      queue.shift();
    }

    queue.push(newNode);
    isLeft = !isLeft;
  }

  return root;
}
// Example usage
const arr: number[] = [1, 2, 3, 4, 5, 6];
const tree = arrayToBinaryTree(arr);
console.log(convertToD3Node(tree));
