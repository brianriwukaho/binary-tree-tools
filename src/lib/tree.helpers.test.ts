import { TreeNode, toD3Node } from "./tree.helpers";

describe("tree.helpers", () => {
  describe("toD3Node", () => {
    test("single node", () => {
      const root = new TreeNode(1);
      const d3Node = toD3Node(root);
      expect(d3Node).toEqual({
        name: "1",
      });
    });
  });
});
