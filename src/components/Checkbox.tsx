import React from "react";

function Checkbox() {
  return (
    <div className="">
      <input
        id="default-checkbox"
        type="checkbox"
        value=""
        className="w-4 h-4 text-blue-600 roundedfocus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600"
      />
    </div>
  );
}

export default Checkbox;
