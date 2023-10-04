interface D3Node<T> {
  name: T;
  children?: D3Node<T>[];
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

export function toD3Node(root: TreeNode | null): D3Node<string> | null {
  if (!root) {
    return null;
  }

  const d3Node: D3Node<string> = {
    name: root.val.toString(),
  };

  const children: D3Node<string>[] = [];

  if (root.left) {
    children.push(toD3Node(root.left)!);
  }

  if (root.right) {
    children.push(toD3Node(root.right)!);
  }

  if (children.length) {
    d3Node.children = children;
  }

  return d3Node;
}
