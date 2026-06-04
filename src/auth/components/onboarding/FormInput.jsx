import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const FormInput = React.forwardRef(({ label, type = 'text', error, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative mb-6 group">
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          id={props.name}
          placeholder=" "
          className={`block w-full px-4 pt-6 pb-2 text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-900 border rounded-xl appearance-none focus:outline-none focus:ring-0 transition-all peer ${
            error 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-zinc-200 dark:border-zinc-700 focus:border-[#2bb75c] hover:border-zinc-300 dark:hover:border-zinc-600'
          }`}
          {...props}
        />
        <label
          htmlFor={props.name}
          className={`absolute text-sm duration-300 transform -tranzinc-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:tranzinc-y-0 peer-focus:scale-75 peer-focus:-tranzinc-y-3 ${
            error ? 'text-red-500' : 'text-zinc-500 dark:text-zinc-400 peer-focus:text-[#2bb75c] dark:peer-focus:text-[#2bb75c]'
          }`}
        >
          {label}
        </label>

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      
      {error && (
        <p className="absolute -bottom-5 left-1 text-xs text-red-500 font-medium">
          {error.message}
        </p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;

