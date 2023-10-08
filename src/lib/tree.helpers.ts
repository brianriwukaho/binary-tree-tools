import { v4 as uuidv4 } from "uuid";

interface D3Node<T> {
  id: string;
  name: T;
  side?: "left" | "right";
  children?: D3Node<T>[];
  isGhost?: boolean;
}

export class TreeNode {
  val: string;
  id: string;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: string, left?: TreeNode | null, right?: TreeNode | null) {
    this.id = uuidv4();
    this.val = val === undefined ? "" : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

export const findTreeNode = (
  root: TreeNode | null,
  id: string
): TreeNode | null => {
  if (!root) {
    return null;
  }

  if (root.id === id) {
    return root;
  }

  const left = findTreeNode(root.left, id);

  if (left) {
    return left;
  }

  const right = findTreeNode(root.right, id);

  if (right) {
    return right;
  }

  return null;
};

export const toD3Node = (
  root: TreeNode | null,
  side?: "left" | "right"
): D3Node<string> | null => {
  if (!root) {
    return null;
  }

  const d3Node: D3Node<string> = {
    id: root.id,
    name: root.val.toString(),
    side: side,
  };

  const children: D3Node<string>[] = [];

  if (root.left) {
    children.push(toD3Node(root.left, "left")!);
  }

  if (root.right) {
    children.push(toD3Node(root.right, "right")!);
  }

  if (children.length === 1) {
    const ghostNode: D3Node<string> = {
      id: root.id,
      name: "",
      side: children[0].side === "left" ? "right" : "left",
      isGhost: true,
    };

    if (children[0].side === "left") {
      children.push(ghostNode);
    } else {
      children.unshift(ghostNode);
    }
  }

  if (children.length) {
    d3Node.children = children;
  }

  return d3Node;
};

export const calculateTraversals = (TreeNode: TreeNode | null) => {
  const levelOrder: string[] = [];
  const inOrder: string[] = [];
  const preOrder: string[] = [];
  const postOrder: string[] = [];

  const bfs = (TreeNode: TreeNode | null) => {
    if (!TreeNode) {
      return;
    }

    const queue: TreeNode[] = [];

    queue.push(TreeNode);

    while (queue.length) {
      const node = queue.shift()!;

      levelOrder.push(node.val);

      if (node.left) {
        queue.push(node.left);
      }

      if (node.right) {
        queue.push(node.right);
      }
    }
  };

  const dfs = (TreeNode: TreeNode | null) => {
    if (!TreeNode) {
      return;
    }

    preOrder.push(TreeNode.val);
    dfs(TreeNode.left);
    inOrder.push(TreeNode.val);
    dfs(TreeNode.right);
    postOrder.push(TreeNode.val);
  };

  dfs(TreeNode);
  bfs(TreeNode);

  return {
    levelOrder,
    inOrder,
    preOrder,
    postOrder,
  };
};

// const root = new TreeNode("A");
// root.left = new TreeNode("B");
// root.right = new TreeNode("C");
// root.left.left = new TreeNode("D");
// root.left.right = new TreeNode("E");
// root.right.left = new TreeNode("F");
// root.right.right = new TreeNode("G");

// console.log(calculateTraversals(root));
