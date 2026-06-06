import React from "react";

const Error = ({ error }) => {
  return (
    <section className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm font-medium text-red-700 shadow-sm">
      {error}
    </section>
  );
};

export default Error;
