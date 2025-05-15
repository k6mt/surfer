import { PathVariableParam, RequestBody } from "@_types/shared";
import FieldNode from "@components/Trace/FieldNode";
import TreeNode from "@components/Trace/TreeNode";

const ParamTreeView = ({ data }: { data: Record<string, any> }) => {
  return (
    <div className="param-tree-view">
      {Object.entries(data).map(([root, value]) => {
        // PathVariable
        if (root === "PathVariable" && Array.isArray(value)) {
          return (
            <TreeNode
              key={root}
              label={root}
              defaultOpen={true}
              hasChildren={value.length > 0}
              isRoot
            >
              {value.map((item: PathVariableParam, i: number) => (
                <TreeNode
                  key={`pv-${i}`}
                  label={`${item.name}: ${item.type}`}
                  defaultOpen={false}
                  hasChildren={false}
                  isRoot={false}
                />
              ))}
            </TreeNode>
          );
        }

        // RequestBody
        if (root === "RequestBody" && value) {
          const body = value as RequestBody;
          const fieldsExist =
            Array.isArray(body.fields) && body.fields.length > 0;

          const elementExist = Boolean(
            body.element && body.element !== undefined
          );

          const mapExist = Boolean(
            body.keyType && body.value && body.type === "Map"
          );

          console.log(fieldsExist, elementExist, mapExist);
          return (
            <TreeNode
              key={root}
              label={root}
              defaultOpen={false}
              hasChildren={fieldsExist || elementExist || mapExist}
              isRoot
            >
              <TreeNode
                label={`${body.name || "<no-name>"}: ${body.type}`}
                defaultOpen={false}
                hasChildren={fieldsExist || elementExist || mapExist}
                isRoot={false}
              >
                {fieldsExist &&
                  body.fields?.map((f, i) => (
                    <FieldNode key={`rbf-${i}`} field={f} />
                  ))}

                {elementExist && (
                  <FieldNode key={`rbf-${body.element}`} field={body.element} />
                )}

                {mapExist && (
                  <FieldNode
                    field={{
                      name: body.name,
                      type: body.type,
                      keyType: body.keyType,
                      value: body.value,
                    }}
                  />
                )}
              </TreeNode>
            </TreeNode>
          );
        }

        if (root === "RequestParam" && Array.isArray(value)) {
          return (
            <TreeNode
              key={root}
              label={root}
              defaultOpen={false}
              hasChildren={true}
              isRoot
            >
              {value.map((param) => (
                <FieldNode
                  key={root}
                  field={{
                    name: param.name,
                    type: param.type,
                  }}
                />
              ))}
            </TreeNode>
          );
        }

        if (root === "RequestHeader" && Array.isArray(value)) {
          return (
            <TreeNode
              key={root}
              label={root}
              defaultOpen={false}
              hasChildren={true}
              isRoot
            >
              {value.map((param) => (
                <FieldNode
                  key={root}
                  field={{
                    name: param.name,
                    type: param.type,
                  }}
                />
              ))}
            </TreeNode>
          );
        }
        return null;
      })}
    </div>
  );
};

export default ParamTreeView;
