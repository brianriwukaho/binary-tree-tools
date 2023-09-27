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

function arrayToBinaryTree(nums: number[]): TreeNode | null {
  if (nums.length === 0) {
    return null;
  }

  const root = new TreeNode(nums[0]);
  const queue: TreeNode[] = [root];
  let isLeft: boolean = true;

  for (let i = 1; i < nums.length; i++) {
    console.log({ queue });
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
