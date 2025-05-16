import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Table = ({ headers, data, onEdit, onDelete, headerClassName, rowClassName }) => {
  const getDataKey = (header) => {
    const map = {
      'Order': 'order',
      'First Name': 'firstName',
      'Last Name': 'lastName',
      'Email': 'email',
      'Phone': 'phone',
      'Address': 'address',
      'Subjects': 'subjects',
      'Classes': 'classes',
      'Profile Pic': 'profilePic',
      'Timeline': 'timeline',
      'Student': 'student',
      'Class': 'class',
      'Submitted At': 'submittedAt',
      'Answers': 'answers',
      'Grade': 'grade',
      'Actions': 'actions',
    };

    if (map[header]) {
      return map[header];
    }

    const camelCaseKey = header
      .toLowerCase()
      .replace(/\s+(\w)/g, (_, char) => char.toUpperCase())
      .replace(/\s+/g, '');

    const snakeCaseKey = header.toLowerCase().replace(/\s+/g, '_');

    const lowerCaseKey = header.toLowerCase().replace(/\s+/g, '');

    return camelCaseKey || snakeCaseKey || lowerCaseKey;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className={headerClassName || 'bg-gray-100'}>
            {headers.map((header, index) => (
              <th key={index} className="py-2 px-4 border-b text-left">
                {header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="py-2 px-4 border-b text-left">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowClassName || 'hover:bg-gray-50'}>
              {headers.map((header, index) => {
                const key = getDataKey(header);

                if (row[key] === undefined) {
                  console.warn(
                    `Table key mismatch: Header="${header}", Mapped Key="${key}", Available Keys: ${Object.keys(row).join(', ')}`
                  );
                }

                return (
                  <td key={index} className="py-2 px-4 border-b">
                    {row[key] !== undefined ? row[key] : 'N/A'}
                  </td>
                );
              })}
              {(onEdit || onDelete) && (
                <td className="py-2 px-4 border-b">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      <FaEdit />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;