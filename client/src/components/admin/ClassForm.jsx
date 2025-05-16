import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTeachers, getStudents } from '../../redux/actions/adminActions';
import CustomFileInput from '../common/CustomFileInput';

const ClassForm = ({ classData, onSubmit, onClose }) => {
  const dispatch = useDispatch();
  const { teachers, students } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    name: '',
    teacherIds: [],
    studentIds: [],
    file: null,
  });

  const [previewFile, setPreviewFile] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    dispatch(getTeachers());
    dispatch(getStudents());

    if (classData) {
      setFormData({
        name: classData.name || '',
        teacherIds: classData.teacherIds || [],
        studentIds: classData.studentIds || [],
        file: null,
      });
      setPreviewFile(classData.timelinePath || null);
      setFileName(classData.timelinePath ? classData.timelinePath.split('/').pop() : '');
    }
  }, [classData, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      setPreviewFile(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('teacherIds', JSON.stringify(formData.teacherIds));
    data.append('studentIds', JSON.stringify(formData.studentIds));
    if (formData.file) {
      data.append('file', formData.file);
    }
    onSubmit(data);
  };


  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 mb-2">
          Class Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <CustomFileInput
          id="file"
          name="file"
          onChange={handleFileChange}
          fileName={fileName}
          label="Timeline File"
        />
        {previewFile && (
          <div className="mt-2">
            <a
              href={previewFile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Preview Timeline
            </a>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {classData ? 'Update' : 'Add'} Class
        </button>
      </div>
    </form>
  );
};

export default ClassForm;