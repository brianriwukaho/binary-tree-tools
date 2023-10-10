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

export const treeToLevelOrderArrayRepresentation = (root: TreeNode | null) => {
  if (root === null) {
    return [];
  }

  const levelOrder: (string | null)[] = [];
  const queue: (TreeNode | null)[] = [];

  queue.push(root);
  let insertNulls = true;

  while (queue.length) {
    const levelSize = queue.length;

    let nextLevelHasNodes = false;

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();

      if (node !== null && node !== undefined) {
        levelOrder.push(node.val);
        queue.push(node.left);
        queue.push(node.right);

        if (node.left || node.right) {
          nextLevelHasNodes = true;
        }
      } else if (insertNulls) {
        levelOrder.push(null);
        queue.push(null, null);
      }
    }

    if (!nextLevelHasNodes) {
      insertNulls = false;
    }
  }

  while (levelOrder[levelOrder.length - 1] === null) {
    levelOrder.pop();
  }

  return levelOrder;
};

export const arrayRepresentationToTree = (arr: (string | null)[]) => {
  if (!arr.length) {
    return null;
  }

  const root = new TreeNode(arr[0]!);
  const queue: (TreeNode | null)[] = [];

  queue.push(root);

  for (let i = 1; i < arr.length; i += 2) {
    const node = queue.shift();

    if (node) {
      if (arr[i] !== null) {
        node.left = new TreeNode(arr[i]!);
        queue.push(node.left);
      }

      if (arr[i + 1] !== null) {
        node.right = new TreeNode(arr[i + 1]!);
        queue.push(node.right);
      }
    }
  }

  return root;
};
