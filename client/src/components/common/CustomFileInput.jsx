import React from 'react';
import { FiUpload } from 'react-icons/fi';

const CustomFileInput = ({ id, name, accept, onChange, fileName, label }) => {
  return (
    <div className="relative">
      <label htmlFor={id} className="block text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center">
        <label
          htmlFor={id}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-l hover:bg-blue-700 cursor-pointer"
        >
          <FiUpload className="mr-2" />
          Choose File
        </label>
        <input
          type="file"
          id={id}
          name={name}
          accept={accept}
          onChange={onChange}
          className="hidden"
        />
        <div className="flex-1 p-2 border border-l-0 rounded-r bg-gray-100 text-gray-700">
          {fileName || 'No file chosen'}
        </div>
      </div>
    </div>
  );
};

export default CustomFileInput;