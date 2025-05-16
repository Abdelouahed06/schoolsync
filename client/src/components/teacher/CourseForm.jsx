import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCourse, updateCourse } from '../../redux/actions/teacherActions';
import { ChevronLeft, ChevronRight, Save, Upload, Plus, Trash2 } from 'lucide-react';
import Select from 'react-select';

const CourseForm = ({ course, onClose }) => {
  const dispatch = useDispatch();
  const { classes, profile } = useSelector((state) => state.teacher);

  const initialFormData = {
    title: '',
    description: '',
    subject: '',
    classIds: [],
    modules: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (profile && classes.length > 0) {
      setIsLoading(false);
      if (course) {
        setFormData({
          title: course.name || '',
          description: course.description || '',
          subject: course.subject?._id || '',
          classIds: course.classIds.map((cls) => cls._id) || [],
          modules: course.modules.map((mod) => ({
            _id: mod._id,
            title: mod.name,
            description: mod.description,
            sections: mod.sections.map((sec) => ({
              _id: sec._id,
              title: sec.name,
              content: sec.description,
              resources: sec.resources.map((res) => ({
                _id: res._id,
                type: res.type,
                sourceType: res.sourceType,
                title: res.name,
                url: res.sourceType === 'url' ? res.path : '',
                file: null,
              })),
            })),
          })),
        });
      }
    }
  }, [course, profile, classes]);

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.title) newErrors.title = 'Course title is required';
      if (!formData.subject) newErrors.subject = 'Subject is required';
      if (formData.classIds.length === 0) newErrors.classIds = 'At least one class is required';
    } else if (step === 2) {
      formData.modules.forEach((module, index) => {
        if (!module.title) newErrors[`module_${index}_title`] = `Module ${index + 1} title is required`;
        module.sections.forEach((section, sIndex) => {
          if (!section.title) newErrors[`section_${index}_${sIndex}_title`] = `Section ${sIndex + 1} title is required`;
          section.resources.forEach((resource, rIndex) => {
            if (!resource.title) newErrors[`resource_${index}_${sIndex}_${rIndex}_title`] = `Resource ${rIndex + 1} title is required`;
            if (resource.sourceType === 'url' && !resource.url && !resource._id) {
              newErrors[`resource_${index}_${sIndex}_${rIndex}_url`] = `Resource ${rIndex + 1} URL is required`;
            } else if (resource.sourceType === 'local' && !resource.file && !resource._id) {
              newErrors[`resource_${index}_${sIndex}_${rIndex}_file`] = `Resource ${rIndex + 1} file is required`;
            }
          });
        });
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleMultiSelectChange = (selected, name) => {
    const values = selected ? selected.map(option => option.value) : [];
    setFormData({ ...formData, [name]: values });
    setErrors({ ...errors, [name]: '' });
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [...formData.modules, { title: '', description: '', sections: [] }],
    });
  };

  const removeModule = (index) => {
    setFormData({
      ...formData,
      modules: formData.modules.filter((_, i) => i !== index),
    });
    setErrors(
      Object.fromEntries(
        Object.entries(errors).filter(([key]) => !key.startsWith(`module_${index}_`))
      )
    );
  };

  const handleModuleChange = (index, field, value) => {
    setFormData({
      ...formData,
      modules: formData.modules.map((mod, i) => (i === index ? { ...mod, [field]: value } : mod)),
    });
    setErrors({ ...errors, [`module_${index}_${field}`]: '' });
  };

  const addSection = (moduleIndex) => {
    setFormData({
      ...formData,
      modules: formData.modules.map((mod, i) =>
        i === moduleIndex
          ? { ...mod, sections: [...mod.sections, { title: '', content: '', resources: [] }] }
          : mod
      ),
    });
  };

  const removeSection = (moduleIndex, sectionIndex) => {
    setFormData({
      ...formData,
      modules: formData.modules.map((mod, i) =>
        i === moduleIndex
          ? { ...mod, sections: mod.sections.filter((_, j) => j !== sectionIndex) }
          : mod
      ),
    });
    setErrors(
      Object.fromEntries(
        Object.entries(errors).filter(([key]) => !key.startsWith(`section_${moduleIndex}_${sectionIndex}_`))
      )
    );
  };

  const handleSectionChange = (moduleIndex, sectionIndex, field, value) => {
    setFormData({
      ...formData,
      modules: formData.modules.map((mod, i) =>
        i === moduleIndex
          ? {
              ...mod,
              sections: mod.sections.map((sec, j) =>
                j === sectionIndex ? { ...sec, [field]: value } : sec
              ),
            }
          : mod
      ),
    });
    setErrors({ ...errors, [`section_${moduleIndex}_${sectionIndex}_${field}`]: '' });
  };

  const addResource = (moduleIndex, sectionIndex) => {
    setFormData({
      ...formData,
      modules: formData.modules.map((mod, i) =>
        i === moduleIndex
          ? {
              ...mod,
              sections: mod.sections.map((sec, j) =>
                j === sectionIndex
                  ? {
                      ...sec,
                      resources: [
                        ...sec.resources,
                        { type: 'pdf', sourceType: 'url', title: '', url: '', file: null },
                      ],
                    }
                  : sec
              ),
            }
          : mod
      ),
    });
  };

  const removeResource = (moduleIndex, sectionIndex, resourceIndex) => {
    setFormData({
      ...formData,
      modules: formData.modules.map((mod, i) =>
        i === moduleIndex
          ? {
              ...mod,
              sections: mod.sections.map((sec, j) =>
                j === sectionIndex
                  ? { ...sec, resources: sec.resources.filter((_, k) => k !== resourceIndex) }
                  : sec
              ),
            }
          : mod
      ),
    });
    setErrors(
      Object.fromEntries(
        Object.entries(errors).filter(
          ([key]) => !key.startsWith(`resource_${moduleIndex}_${sectionIndex}_${resourceIndex}_`)
        )
      )
    );
  };

  const handleResourceChange = (moduleIndex, sectionIndex, resourceIndex, field, value) => {
    setFormData({
      ...formData,
      modules: formData.modules.map((mod, i) =>
        i === moduleIndex
          ? {
              ...mod,
              sections: mod.sections.map((sec, j) =>
                j === sectionIndex
                  ? {
                      ...sec,
                      resources: sec.resources.map((res, k) =>
                        k === resourceIndex ? { ...res, [field]: value } : res
                      ),
                    }
                  : sec
              ),
            }
          : mod
      ),
    });
    setErrors({ ...errors, [`resource_${moduleIndex}_${sectionIndex}_${resourceIndex}_${field}`]: '' });
  };

  const handleFileChange = (moduleIndex, sectionIndex, resourceIndex, e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      modules: formData.modules.map((mod, i) =>
        i === moduleIndex
          ? {
              ...mod,
              sections: mod.sections.map((sec, j) =>
                j === sectionIndex
                  ? {
                      ...sec,
                      resources: sec.resources.map((res, k) =>
                        k === resourceIndex ? { ...res, file } : res
                      ),
                    }
                  : sec
              ),
            }
          : mod
      ),
    });
    setErrors({ ...errors, [`resource_${moduleIndex}_${sectionIndex}_${resourceIndex}_file`]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      const files = [];
      let courseData = {};

      if (course) {
        if (formData.title !== course.name) courseData.name = formData.title;
        if (formData.description !== course.description) courseData.description = formData.description;
        if (JSON.stringify(formData.classIds) !== JSON.stringify(course.classIds.map((cls) => cls._id))) {
          courseData.classIds = formData.classIds;
        }

        const originalModules = course.modules.map((mod) => ({
          _id: mod._id,
          name: mod.name,
          description: mod.description,
          sections: mod.sections.map((sec) => ({
            _id: sec._id,
            name: sec.name,
            description: sec.description,
            resources: sec.resources.map((res) => ({
              _id: res._id,
              type: res.type,
              sourceType: res.sourceType,
              name: res.name,
              path: res.path,
            })),
          })),
        }));

        const newModules = formData.modules.map((module) => ({
          _id: module._id || undefined,
          name: module.title,
          description: module.description,
          sections: module.sections.map((section) => ({
            _id: section._id || undefined,
            name: section.title,
            description: section.content,
            resources: section.resources.map((resource) => {
              const originalResource = course.modules
                .flatMap((m) => m.sections)
                .flatMap((s) => s.resources)
                .find((r) => r._id === resource._id);
              return {
                _id: resource._id || undefined,
                type: resource.type,
                sourceType: resource.sourceType,
                name: resource.title,
                path: resource.sourceType === 'url' ? resource.url : originalResource ? originalResource.path : undefined,
              };
            }),
          })),
        }));

        if (JSON.stringify(newModules) !== JSON.stringify(originalModules)) {
          courseData.modules = newModules;
        }

        formData.modules.forEach((module) => {
          module.sections.forEach((section) => {
            section.resources.forEach((resource) => {
              if (resource.sourceType === 'local' && resource.file && !resource._id) {
                files.push(resource.file);
              }
            });
          });
        });

        if (Object.keys(courseData).length > 0 || files.length > 0) {
          await dispatch(updateCourse(course._id, courseData, files));
        }
      } else {
        courseData = {
          subject: formData.subject,
          classIds: formData.classIds,
          name: formData.title,
          description: formData.description,
          modules: formData.modules.map((module) => ({
            name: module.title,
            description: module.description,
            sections: module.sections.map((section) => ({
              name: section.title,
              description: section.content,
              resources: section.resources.map((resource) => ({
                type: resource.type,
                sourceType: resource.sourceType,
                name: resource.title,
                path: resource.sourceType === 'url' ? resource.url : undefined,
              })),
            })),
          })),
        };

        formData.modules.forEach((module) => {
          module.sections.forEach((section) => {
            section.resources.forEach((resource) => {
              if (resource.sourceType === 'local' && resource.file) {
                files.push(resource.file);
              }
            });
          });
        });

        await dispatch(addCourse(courseData, files));
      }

      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to save course. Please try again.' });
      console.error('Submission error:', error);
    }
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const subjectOptions = profile?.subjects?.map((sub) => ({
    value: sub._id,
    label: sub.name,
  })) || [];

  const classOptions = classes.map((cls) => ({
    value: cls._id,
    label: cls.name,
  })) || [];

  if (isLoading) {
    return (
      <div className="text-center p-4 text-gray-500 animate-pulse">
        Loading subjects and classes...
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          {course ? 'Edit Course' : 'Create New Course'}
        </h2>
        <div className="flex justify-between items-center gap-1 mb-6">
          {['Details', 'Modules', 'Review'].map((label, index) => (
            <div key={index} className="flex-1 text-center">
              <div className="flex items-center justify-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    step > index + 1 ? 'bg-indigo-600 text-white' : 
                    step === index + 1 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
              </div>
              <p className="text-xs mt-1 text-gray-600">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        {step === 1 && (
          <div className="space-y-3">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Course Details</h3>
            
            <div>
              <label htmlFor="title" className="block text-sm text-gray-700 mb-1">
                Course Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Introduction to Algebra"
              />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm text-gray-700 mb-1">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  errors.subject ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Subject</option>
                {profile?.subjects?.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
              {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-1">Classes</label>
              <Select
                isMulti
                options={classOptions}
                value={classOptions.filter(option => formData.classIds.includes(option.value))}
                onChange={(selected) => handleMultiSelectChange(selected, 'classIds')}
                className="basic-multi-select text-sm"
                classNamePrefix="select"
                placeholder="Select classes..."
                noOptionsMessage={() => 'No classes available'}
                isDisabled={classes.length === 0}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '36px',
                    fontSize: '14px',
                    borderColor: errors.classIds ? '#ef4444' : '#d1d5db',
                    '&:hover': {
                      borderColor: errors.classIds ? '#ef4444' : '#d1d5db'
                    }
                  })
                }}
              />
              {errors.classIds && <p className="mt-1 text-xs text-red-500">{errors.classIds}</p>}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                rows="3"
                placeholder="Course description..."
              />
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={nextStep}
                className="bg-indigo-600 text-white px-3 py-1.5 text-sm rounded hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 flex items-center gap-1"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Modules</h3>
            
            {formData.modules.length === 0 ? (
              <div className="text-center py-4">
                <button
                  type="button"
                  onClick={addModule}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 mx-auto"
                >
                  <Plus size={16} /> Add First Module
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-semibold text-gray-800">Module {moduleIndex + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeModule(moduleIndex)}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                          className={`w-full p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                            errors[`module_${moduleIndex}_title`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Module title"
                        />
                        {errors[`module_${moduleIndex}_title`] && (
                          <p className="mt-1 text-xs text-red-500">{errors[`module_${moduleIndex}_title`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Description</label>
                        <textarea
                          value={module.description}
                          onChange={(e) => handleModuleChange(moduleIndex, 'description', e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          rows="2"
                          placeholder="Module description..."
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="text-sm font-semibold text-gray-800">Sections</h5>
                        <button
                          type="button"
                          onClick={() => addSection(moduleIndex)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
                        >
                          <Plus size={14} /> Add Section
                        </button>
                      </div>
                      
                      {module.sections.length === 0 ? (
                        <div className="text-center py-3 bg-gray-100 rounded-lg">
                          <p className="text-gray-500 text-sm mb-2">No sections added yet</p>
                          <button
                            type="button"
                            onClick={() => addSection(moduleIndex)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 mx-auto"
                          >
                            <Plus size={14} /> Add First Section
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {module.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="border rounded-lg p-3 bg-white">
                              <div className="flex justify-between items-center mb-2">
                                <h6 className="text-sm font-semibold text-gray-800">Section {sectionIndex + 1}</h6>
                                <button
                                  type="button"
                                  onClick={() => removeSection(moduleIndex, sectionIndex)}
                                  className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                >
                                  <Trash2 size={14} /> Remove
                                </button>
                              </div>
                              
                              <div className="space-y-3 mb-3">
                                <div>
                                  <label className="block text-sm text-gray-700 mb-1">Title</label>
                                  <input
                                    type="text"
                                    value={section.title}
                                    onChange={(e) => handleSectionChange(moduleIndex, sectionIndex, 'title', e.target.value)}
                                    className={`w-full p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                                      errors[`section_${moduleIndex}_${sectionIndex}_title`] ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Section title"
                                  />
                                  {errors[`section_${moduleIndex}_${sectionIndex}_title`] && (
                                    <p className="mt-1 text-xs text-red-500">
                                      {errors[`section_${moduleIndex}_${sectionIndex}_title`]}
                                    </p>
                                  )}
                                </div>
                                
                                <div>
                                  <label className="block text-sm text-gray-700 mb-1">Content</label>
                                  <textarea
                                    value={section.content}
                                    onChange={(e) => handleSectionChange(moduleIndex, sectionIndex, 'content', e.target.value)}
                                    className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    rows="2"
                                    placeholder="Section content..."
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <h6 className="text-sm font-semibold text-gray-800">Resources</h6>
                                  <button
                                    type="button"
                                    onClick={() => addResource(moduleIndex, sectionIndex)}
                                    className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
                                  >
                                    <Plus size={14} /> Add Resource
                                  </button>
                                </div>
                                
                                {section.resources.length === 0 ? (
                                  <div className="text-center py-2 bg-gray-100 rounded-lg">
                                    <p className="text-gray-500 text-sm mb-2">No resources added yet</p>
                                    <button
                                      type="button"
                                      onClick={() => addResource(moduleIndex, sectionIndex)}
                                      className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 mx-auto"
                                    >
                                      <Plus size={14} /> Add First Resource
                                    </button>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    {section.resources.map((resource, resourceIndex) => (
                                      <div key={resourceIndex} className="border rounded-lg p-3 bg-gray-50">
                                        <div className="flex justify-between items-center mb-2">
                                          <span className="text-sm font-medium text-gray-800">Resource {resourceIndex + 1}</span>
                                          <button
                                            type="button"
                                            onClick={() => removeResource(moduleIndex, sectionIndex, resourceIndex)}
                                            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                          >
                                            <Trash2 size={14} /> Remove
                                          </button>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <div>
                                            <label className="block text-xs text-gray-700 mb-1">Type</label>
                                            <select
                                              value={resource.type}
                                              onChange={(e) =>
                                                handleResourceChange(moduleIndex, sectionIndex, resourceIndex, 'type', e.target.value)
                                              }
                                              className="w-full p-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            >
                                              <option value="pdf">PDF</option>
                                              <option value="video">Video</option>
                                              <option value="link">Link</option>
                                            </select>
                                          </div>
                                          
                                          <div>
                                            <label className="block text-xs text-gray-700 mb-1">Source Type</label>
                                            <select
                                              value={resource.sourceType}
                                              onChange={(e) =>
                                                handleResourceChange(moduleIndex, sectionIndex, resourceIndex, 'sourceType', e.target.value)
                                              }
                                              className="w-full p-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            >
                                              <option value="url">URL</option>
                                              <option value="local">Local File</option>
                                            </select>
                                          </div>
                                          
                                          <div>
                                            <label className="block text-xs text-gray-700 mb-1">Title</label>
                                            <input
                                              type="text"
                                              value={resource.title}
                                              onChange={(e) =>
                                                handleResourceChange(moduleIndex, sectionIndex, resourceIndex, 'title', e.target.value)
                                              }
                                              className={`w-full p-2 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                                                errors[`resource_${moduleIndex}_${sectionIndex}_${resourceIndex}_title`]
                                                  ? 'border-red-500'
                                                  : 'border-gray-300'
                                              }`}
                                              placeholder="Resource title"
                                            />
                                            {errors[`resource_${moduleIndex}_${sectionIndex}_${resourceIndex}_title`] && (
                                              <p className="mt-1 text-xs text-red-500">
                                                {errors[`resource_${moduleIndex}_${sectionIndex}_${resourceIndex}_title`]}
                                              </p>
                                            )}
                                          </div>
                                          
                                          {resource.sourceType === 'url' ? (
                                            <div>
                                              <label className="block text-xs text-gray-700 mb-1">URL</label>
                                              <input
                                                type="url"
                                                value={resource.url}
                                                onChange={(e) =>
                                                  handleResourceChange(moduleIndex, sectionIndex, resourceIndex, 'url', e.target.value)
                                                }
                                                className={`w-full p-2 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                                                  errors[`resource_${moduleIndex}_${sectionIndex}_${resourceIndex}_url`]
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                                }`}
                                                placeholder="https://example.com"
                                              />
                                              {errors[`resource_${moduleIndex}_${sectionIndex}_${resourceIndex}_url`] && (
                                                <p className="mt-1 text-xs text-red-500">
                                                  {errors[`resource_${moduleIndex}_${sectionIndex}_${resourceIndex}_url`]}
                                                </p>
                                              )}
                                            </div>
                                          ) : (
                                            <div>
                                              <label className="block text-xs text-gray-700 mb-1">Upload File</label>
                                              <div className="flex items-center gap-1">
                                                <input
                                                  type="file"
                                                  onChange={(e) => handleFileChange(moduleIndex, sectionIndex, resourceIndex, e)}
                                                  className={`w-full p-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                                                    errors[`resource_${moduleIndex}_${sectionIndex}_${resourceIndex}_file`]
                                                      ? 'border-red-500'
                                                      : 'border-gray-300'
                                                  }`}
                                                  accept=".pdf,.mp4"
                                                />
                                                <Upload size={14} className="text-gray-500" />
                                              </div>
                                              {errors[`resource_${moduleIndex}_${sectionIndex}_${resourceIndex}_file`] && (
                                                <p className="mt-1 text-xs text-red-500">
                                                  {errors[`resource_${moduleIndex}_${sectionIndex}_${resourceIndex}_file`]}
                                                </p>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-500 flex items-center justify-center gap-2"
              >
                <ChevronLeft size={16} /> Back
              </button>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={addModule}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
                >
                  Add Module
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 flex items-center justify-center gap-2"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Review & Submit</h3>
            
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Course Details</h4>
              <div className="space-y-2 text-sm">
                <p className="break-words"><span className="font-medium">Title:</span> {formData.title || 'N/A'}</p>
                <p className="break-words"><span className="font-medium">Description:</span> {formData.description || 'N/A'}</p>
                <p className="break-words"><span className="font-medium">Subject:</span> {profile?.subjects?.find((sub) => sub._id === formData.subject)?.name || 'N/A'}</p>
                <p className="break-words"><span className="font-medium">Classes:</span> {formData.classIds.map((id) => classes.find((cls) => cls._id === id)?.name).join(', ') || 'None'}</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Modules</h4>
              {formData.modules.length === 0 ? (
                <p className="text-gray-500 text-sm">No modules added.</p>
              ) : (
                <div className="space-y-4">
                  {formData.modules.map((module, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium break-words"><span className="font-semibold">Module {index + 1}:</span> {module.title}</p>
                      {module.description && (
                        <p className="text-gray-600 ml-2 break-words">{module.description}</p>
                      )}
                      {module.sections.map((section, sIndex) => (
                        <div key={sIndex} className="ml-3 mt-2 pl-2 border-l-2 border-gray-200">
                          <p className="font-medium break-words"><span className="font-semibold">Section {sIndex + 1}:</span> {section.title}</p>
                          {section.content && (
                            <p className="text-gray-600 ml-2 break-words">{section.content}</p>
                          )}
                          {section.resources.map((resource, rIndex) => (
                            <p key={rIndex} className="text-gray-600 ml-4 break-words">
                              <span className="font-medium">Resource {rIndex + 1}:</span> {resource.title} (
                              {resource.sourceType === 'url' ? resource.url : 'File'})
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {errors.submit && <p className="text-xs text-red-500 mt-2">{errors.submit}</p>}
            
            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-500 flex items-center justify-center gap-2"
              >
                <ChevronLeft size={16} /> Back
              </button>
              <button
                onClick={handleSubmit}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 flex items-center justify-center gap-2"
              >
                <Save size={16} /> {course ? 'Update' : 'Create'} Course
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseForm;