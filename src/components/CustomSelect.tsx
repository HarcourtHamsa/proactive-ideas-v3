import { useFetchCategoriesQuery } from "@/features/apiSlice";
import React from "react";
import Select from "react-select";

function formatCategories(c: []) {

}
const options = [
  { value: "Technology", label: "Technology" },
  { value: "Blockchain", label: "Blockchain" },
  { value: "Education", label: "Education" },
  { value: "Health", label: "Health" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Career", label: "Career" },
  { value: "Music", label: "Music" },
  { value: "SEO", label: "SEO" },
];

function CustomSelect({
  group = '',
  onChange,
  value,
}: {
  group?: string
  onChange: (e: any) => void;
  value: any;
}) {

  const { data: categories } = useFetchCategoriesQuery({ group })

  function formatCategories(c: []) {
    const arr: any[] = [{ value: "Default", label: "Default" },]

    c?.map((data: any) => {
      arr.push({ value: data.name, label: data.name })
    })


    return arr
  }



  const newOptions = formatCategories(categories?.data);


  return (
    <Select
      isMulti
      name="colors"
      options={newOptions}
      className="basic-multi-select  text-gray-800"
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: "#F9FAFB",
          color: 'red',
          border: "1px solid #ddd"
        }),
      }}
      classNamePrefix="select"
      onChange={onChange}
      value={value}
    />
  );
}

export default CustomSelect;
