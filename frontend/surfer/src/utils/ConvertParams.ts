/*
1. Key로 Root 구분
2. Root별로 Array로 만들기
3. Array 순회하면서 Tree 만들기
*/

import { TracedParams } from "@_types/shared";

function cherryPickRoot(raw: Record<string, any>) {
  return Object.keys(raw);
}

function getTreeArray(raw: Record<string, any>, roots: string[]) {
  return Object.keys(raw)
    .filter((root) => roots.includes(root))
    .map((root) => raw[root]);
}

function getTreeItems(): TracedParams {
  const;
}

export { cherryPickRoot, getTreeArray };
