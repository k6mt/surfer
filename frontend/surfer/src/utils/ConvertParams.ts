import { PathVariableParam, RequestBody } from "@_types/shared";

/*
1. Key로 Root 구분
2. Root별로 Array로 만들기
3. Array 순회하면서 Tree 만들기
*/
function cherryPickRoot(raw: Record<string, any>) {
  return Object.keys(raw);
}

// function getTree(raw: Record<string, any>, root: string) {
//   const result: TracedParams = {};

//   Object.entries(raw).map(([key, value]) => {
//     switch (key) {
//       case "PathVariable" :

//     }
//   });
// }

function extractPathVariable(raw: Record<string, any>): PathVariableParam[] {
  return Array.isArray(raw["PathVariable"]) ? raw["PathVariable"] : [];
}

export { cherryPickRoot };
