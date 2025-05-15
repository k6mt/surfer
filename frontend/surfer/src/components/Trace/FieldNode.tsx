import { CommonField } from "@_types/shared";
import TreeNode from "@components/Trace/TreeNode";

const FieldNode: React.FC<{ field: CommonField }> = ({ field }) => {
  const hasFields = Array.isArray(field.fields) && field.fields.length > 0;
  const hasElement = !!field.element;
  const hasMap = !!(field.keyType && field.value && field.type === "Map");

  const hasChildren = hasFields || hasElement || hasMap;

  if (hasMap)
    return (
      <>
        {/* map */}
        {hasMap && (
          <FieldNode
            key="map-value"
            field={{
              name: "value",
              type: field.value!.type,
              fields: field.value!.fields,
              element: field.value!.element,
              keyType: field.value!.keyType,
              value: field.value!.value,
            }}
          />
        )}
      </>
    );

  return (
    <TreeNode
      label={`${field.name ? `${field.name} :` : ""} ${field.type}`}
      defaultOpen={false}
      hasChildren={hasChildren}
      isRoot={false}
    >
      {/* fields */}
      {hasFields &&
        field.fields!.map((sub, idx) => (
          <FieldNode key={`f-${idx}`} field={sub} />
        ))}

      {/* element */}
      {hasElement && field.element && (
        <FieldNode
          key="element"
          field={{
            name: "element",
            type: field.element.type,
            fields: field.element.fields,
            element: field.element.element,
          }}
        />
      )}
    </TreeNode>
  );
};

export default FieldNode;
