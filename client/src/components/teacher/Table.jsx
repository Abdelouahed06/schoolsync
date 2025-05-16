import React from 'react';

const Table = ({ headers, data, emptyMessage }) => {
  const getDataKey = (header) => {
    const map = {
      'Order': 'order',
      'Profile': 'profile',
      'Class Name': 'className',
      'First Name': 'firstName',
      'Last Name': 'lastName',
      'Timeline': 'timeline'
    };
    return map[header] || header.toLowerCase().replace(/\s+/g, '');
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row._id} className="hover:bg-gray-50">
                {headers.map((header, index) => {
                  const key = getDataKey(header);
                  return (
                    <td
                      key={index}
                      className={`px-6 py-4 whitespace-nowrap ${
                        key === 'profile' ? '' : 'text-sm text-gray-900'
                      }`}
                    >
                      {row[key]}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="px-6 py-4 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;