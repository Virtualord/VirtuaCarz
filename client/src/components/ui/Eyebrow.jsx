import React from "react";

const Eyebrow = ({ children, className = "" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <span className="h-px w-10 bg-accent" aria-hidden="true" />
    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
      {children}
    </p>
  </div>
);

export default Eyebrow;
