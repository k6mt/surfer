import { Field } from "@_types/shared";
import MethodSelect from "@components/common/MethodSelect";
import React from "react";

const UrlSendbox = ({
  method,
  url,
  isOption,
}: {
  method: Field;
  url: Field;
  isOption: boolean;
}) => {
  return (
    <div className="url-container">
      <div className="url-method-row">
        <MethodSelect
          value={method.state.value}
          isOption={isOption}
          onChange={(newValue) =>
            method.state.handleInputChange({
              target: { value: newValue },
            } as React.ChangeEvent<HTMLSelectElement>)
          }
        />

        <div className="divider" />

        <input
          id="url"
          name="url"
          type="text"
          className="form-input"
          value={url.state.value}
          onChange={url.state.handleInputChange}
          required
          // readOnly={!isOption}
        />
      </div>
      <button className="url-send-btn" type="submit">
        <div className="url-send-btn-txt">Send</div>
      </button>
    </div>
  );
};

export default UrlSendbox;
