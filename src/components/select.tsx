"use client";

import { type DetailedHTMLProps, type SelectHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

type SelectProps = DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  optionsName?: string[];
  optionsId?: number[];
  name: string;
  displayName: string;
  defaultValue: string | undefined;
};

export const Select = ({
  displayName,
  name,
  optionsName,
  optionsId,
  defaultValue,
  ...selectProps
}: SelectProps) => {
  const isLoading = optionsName === undefined;
  const { register } = useFormContext();

  return (
    <>
      <label className="" htmlFor={name}>
        {displayName}
      </label>
      <select
        className="w-52 cursor-pointer appearance-none rounded-lg bg-slate-50 px-3 py-1.5 shadow mb-4"
        id={name}
        disabled={isLoading}
        {...selectProps}
        {...register(name)}
        defaultValue={defaultValue}
      >
        {(optionsName ?? ["Loading..."]).map((name, index) => {
          const value = optionsId === undefined ? name : optionsId![index];
          return (
            <option key={value} value={value}>
              {name}
            </option>
          );
        })}
      </select>
    </>
  );
};
