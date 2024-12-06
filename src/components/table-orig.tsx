import { ReactNode } from "react";

export const Td = ({ children }: { children: string }) => {
  return <td className="p-2 text-center w-52">{children}</td>;
};

export const Th = ({ children }: { children: string }) => {
  return <th className="p-2 text-center text-blue-600">{children}</th>;
};

export const Tr = ({ children }: { children: ReactNode[] }) => {
  return <tr className="border border-b-gray-400">{children}</tr>;
};
