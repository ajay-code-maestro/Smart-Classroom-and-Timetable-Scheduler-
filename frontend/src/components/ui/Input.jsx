export const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && <label className="text-sm font-semibold text-foreground/70 ml-1 mb-1">{label}</label>}
      <div className="relative group">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="glass-input px-4 py-3 w-full text-foreground placeholder:text-foreground/30 focus:ring-0 appearance-none transition-all duration-300 border-white/5 active:scale-[0.99]"
          {...props}
        />
        <div className="absolute inset-0 rounded-xl border border-primary/0 group-focus-within:border-primary/50 transition-colors pointer-events-none shadow-[0_0_15px_rgba(59,130,246,0)] group-focus-within:shadow-[0_0_15px_rgba(59,130,246,0.1)]" />
      </div>
    </div>
  );
};
