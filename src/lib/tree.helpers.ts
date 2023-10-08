interface D3Node<T> {
  id: string;
  name: T;
  side?: "left" | "right";
  children?: D3Node<T>[];
  isGhost?: boolean;
}

export class TreeNode {
  val: string;
  id?: string;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: string, left?: TreeNode | null, right?: TreeNode | null) {
    this.id = generateUUID();
    this.val = val === undefined ? "" : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

const generateUUID = () => {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  array[6] = (array[6] & 0x0f) | 0x40;
  array[8] = (array[8] & 0x3f) | 0x80;

  return Array.from(array)
    .map((byte, index) => {
      return (
        (index === 4 || index === 6 || index === 8 || index === 10 ? "-" : "") +
        byte.toString(16).padStart(2, "0")
      );
    })
    .join("");
};

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
