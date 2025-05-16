import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';

const QuizForm = ({ quiz, onSubmit, onClose }) => {
  const { classes, profile } = useSelector((state) => state.teacher);

  const initialFormData = {
    subject: '',
    classIds: [],
    title: '',
    type: 'qcm',
    questions: [{ type: 'qcm', question: '', options: ['', '', '', ''], correctAnswer: '' }],
    isPublished: false,
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (quiz) {
      setFormData({
        subject: quiz.subject?._id || '',
        classIds: quiz.classIds?.map(cls => ({ value: cls._id, label: cls.name })) || [],
        title: quiz.title || '',
        type: quiz.type || 'qcm',
        questions: quiz.questions?.map(q => ({
          type: q.type || quiz.type,
          question: q.question || '',
          options: q.options?.length ? q.options : (q.type === 'qcm' ? ['', '', '', ''] : []),
          correctAnswer: q.correctAnswer || (q.type === 'file_upload' ? undefined : ''),
        })) || [{ type: quiz.type || 'qcm', question: '', options: ['', '', '', ''], correctAnswer: '' }],
        isPublished: quiz.isPublished || false,
      });
    } else if (profile?.subjects?.length) {
      setFormData(prev => ({ ...prev, subject: profile.subjects[0]._id }));
    }
  }, [quiz, profile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleClassChange = (selectedOptions) => {
    setFormData({
      ...formData,
      classIds: selectedOptions || [],
    });
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFormData({
      ...formData,
      type: newType,
      questions: formData.questions.map(q => ({
        type: newType,
        question: q.question,
        options: newType === 'qcm' ? (q.options?.length ? q.options : ['', '', '', '']) : undefined,
        correctAnswer: newType === 'file_upload' ? undefined : (newType === 'direct_answer' ? q.correctAnswer || '' : q.correctAnswer),
      })),
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    if (field === 'question' || field === 'correctAnswer') {
      newQuestions[index][field] = value;
    } else {
      const optionIndex = parseInt(field.split('-')[1]);
      newQuestions[index].options[optionIndex] = value;
    }
    setFormData({ ...formData, questions: newQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          type: formData.type,
          question: '',
          options: formData.type === 'qcm' ? ['', '', '', ''] : undefined,
          correctAnswer: formData.type === 'file_upload' ? undefined : '',
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      subject: formData.subject,
      classIds: JSON.stringify(formData.classIds.map(opt => opt.value)),
      title: formData.title,
      type: formData.type,
      questions: JSON.stringify(formData.questions.map(q => {
        if (q.type === 'file_upload') {
          return {
            type: q.type,
            question: q.question,
          };
        }
        if (q.type === 'direct_answer') {
          return {
            type: q.type,
            question: q.question,
            correctAnswer: q.correctAnswer || undefined,
          };
        }
        return {
          type: q.type,
          question: q.question,
          options: q.options?.length ? q.options : undefined,
          correctAnswer: q.correctAnswer || undefined,
        };
      })),
      isPublished: formData.isPublished,
    };
    console.log('Submitting quiz data:', formattedData);
    onSubmit(formattedData);
    onClose();
  };

  const classOptions = classes.map(cls => ({
    value: cls._id,
    label: cls.name,
  }));

  console.log('Classes in QuizForm:', classes);
  console.log('Class Options for react-select:', classOptions);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="subject" className="block text-gray-700 mb-2">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        >
          <option value="">Select Subject</option>
          {profile?.subjects?.map(subject => (
            <option key={subject._id} value={subject._id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Classes</label>
        {classes.length === 0 ? (
          <p className="text-red-500">No classes available. Please ensure classes are loaded.</p>
        ) : (
          <Select
            isMulti
            options={classOptions}
            value={formData.classIds}
            onChange={handleClassChange}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select Classes"
          />
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 mb-2">
          Quiz Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="type" className="block text-gray-700 mb-2">
          Quiz Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleTypeChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        >
          <option value="qcm">QCM</option>
          <option value="direct_answer">Direct Answer</option>
          <option value="file_upload">File Upload</option>
        </select>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Questions</h3>
        {formData.questions.map((q, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <div className="mb-2">
              <label className="block text-gray-700 mb-1">Question {index + 1}</label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            {formData.type === 'qcm' && (
              <>
                <div className="mb-2">
                  <label className="block text-gray-700 mb-1">Options</label>
                  {q.options?.map((option, optIndex) => (
                    <input
                      key={optIndex}
                      type="text"
                      value={option}
                      onChange={(e) => handleQuestionChange(index, `option-${optIndex}`, e.target.value)}
                      className="w-full p-2 border rounded mb-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={`Option ${optIndex + 1}`}
                      required
                    />
                  ))}
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 mb-1">Correct Answer</label>
                  <input
                    type="text"
                    value={q.correctAnswer}
                    onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </>
            )}
            {formData.type === 'direct_answer' && (
              <div className="mb-2">
                <label className="block text-gray-700 mb-1">Correct Answer</label>
                <input
                  type="text"
                  value={q.correctAnswer}
                  onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            )}
            {formData.questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove Question
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestion}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Question
        </button>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-gray-700">Publish Quiz</span>
        </label>
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
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {quiz ? 'Update' : 'Add'} Quiz
        </button>
      </div>
    </form>
  );
};

export default QuizForm;