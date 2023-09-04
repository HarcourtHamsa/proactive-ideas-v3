import React from "react";

interface ICustomInput {
  label: string;
  type: "password" | "email" | "text";
  name?: string;
  value?: string;
  onChange?: any;
}

function CustomInput({ label, type, name, value, onChange }: ICustomInput) {
  return (
    <div>
      <span className="text-black">{label}</span>
      <input
        name={name}
        className="h-[45px] text-black focus:border-2  px-2 w-[100%] bg-gray-50 rounded border-2 outline-none focus:border-blue-500"
        required={true}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default CustomInput;
