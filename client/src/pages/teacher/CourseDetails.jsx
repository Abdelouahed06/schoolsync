import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse } from '../../redux/actions/teacherActions';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { PlayCircle, FileText, ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react';

const CourseDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Change courseId to id
  
  console.log('useParams output:', { id });

  const { currentCourse, profile, error } = useSelector((state) => state.teacher);
  const [expandedModules, setExpandedModules] = useState({});
  const [playingVideo, setPlayingVideo] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('CourseDetails useEffect triggered with courseId:', id);
    if (id) {
      dispatch(getCourse(id))
        .then(() => {
          console.log('getCourse action resolved successfully');
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('getCourse action failed:', err);
          setIsLoading(false);
        });
    } else {
      console.log('No courseId provided, setting isLoading to false');
      setIsLoading(false);
    }
  }, [dispatch, id]);

  useEffect(() => {
    console.log('Current state:', { isLoading, currentCourse, error });
  }, [isLoading, currentCourse, error]);

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const handleResourceClick = (resource) => {
    if (resource.type === 'video') {
      if (playingVideo?.resourceId === resource._id) {
        setPlayingVideo(null);
      } else {
        setPlayingVideo({ resourceId: resource._id, resource });
      }
    } else if (resource.type === 'pdf' && resource.sourceType === 'local') {
      window.open(`http://localhost:5000${resource.path}`, '_blank');
    } else if (resource.sourceType === 'url') {
      window.open(resource.path, '_blank');
    }
  };

  const isYouTubeUrl = (url) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  if (isLoading) {
    console.log('Rendering loading UI');
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar expanded={expanded} setExpanded={setExpanded} />
        <div className="flex-1 flex flex-col">
          <Header expanded={expanded} setExpanded={setExpanded} />
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-6">
              <p>Loading course details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !currentCourse || currentCourse._id !== id) { // Change courseId to id
    console.log('Rendering error UI:', { error, currentCourse, courseId: id });
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar expanded={expanded} setExpanded={setExpanded} />
        <div className="flex-1 flex flex-col">
          <Header expanded={expanded} setExpanded={setExpanded} />
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-6">
              <p className="text-red-600">{error || 'Course not found'}</p>
              <button
                onClick={() => navigate('/teacher/courses')}
                className="mt-4 flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <ArrowLeft className="w-5 h-5 mr-1" /> Back to Courses
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  console.log('Rendering course details UI with currentCourse:', currentCourse);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <div className="flex-1 flex flex-col">
        <Header expanded={expanded} setExpanded={setExpanded} />
        <main className="flex-1 p-6 mt-10">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 mt-4">
              <button
                onClick={() => navigate('/teacher/courses')}
                className="flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <ArrowLeft className="w-5 h-5 mr-1" /> Back to Courses
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative h-64 w-full bg-gradient-to-r from-indigo-500 to-purple-600">
                {currentCourse.thumbnail ? (
                  <img
                    src={`http://localhost:5000${currentCourse.thumbnail}`}
                    alt={currentCourse.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                  <h1 className="text-3xl font-bold text-white">{currentCourse.name}</h1>
                  <p className="text-white/90 mt-1">{currentCourse.classIds.map((cls) => cls.name).join(', ') || 'No classes'}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-2/3">
                    <h2 className="text-xl font-semibold mb-4">Course Description</h2>
                    <p className="text-gray-700 mb-6">{currentCourse.description || 'No description provided.'}</p>

                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Course Content</h2>
                        <span className="text-sm text-gray-600">
                          {currentCourse.modules.length} modules •{' '}
                          {currentCourse.modules.reduce((total, mod) => total + (mod.sections?.length || 0), 0)} sections
                        </span>
                      </div>

                      {currentCourse.modules.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                          No modules available for this course.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {currentCourse.modules.map((module) => (
                            <div key={module._id} className="border rounded-lg overflow-hidden">
                              <button
                                onClick={() => toggleModule(module._id)}
                                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center">
                                  {expandedModules[module._id] ? (
                                    <ChevronDown className="w-5 h-5 text-gray-600 mr-3" />
                                  ) : (
                                    <ChevronRight className="w-5 h-5 text-gray-600 mr-3" />
                                  )}
                                  <div>
                                    <span className="font-medium text-gray-900 text-left">{module.name}</span>
                                    <p className="text-sm text-gray-500 mt-1">{module.description || 'No description'}</p>
                                  </div>
                                </div>
                                <span className="text-sm text-gray-600 px-2 py-1 rounded">
                                  {module.sections.length} sections
                                </span>
                              </button>
                              {expandedModules[module._id] && (
                                <div className="divide-y divide-gray-200">
                                  {module.sections.length === 0 ? (
                                    <div className="p-4 text-gray-500 text-sm">No sections available.</div>
                                  ) : (
                                    module.sections.map((section) => (
                                      <div key={section._id} className="p-4">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <h4 className="font-medium text-gray-900">{section.name}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{section.description || 'No description'}</p>
                                          </div>
                                        </div>
                                        <div className="mt-3 space-y-2">
                                          {section.resources.map((resource) => (
                                            <div key={resource._id} className="flex items-center">
                                              <button
                                                onClick={() => handleResourceClick(resource)}
                                                className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
                                              >
                                                {resource.type === 'video' ? (
                                                  <PlayCircle className="w-5 h-5 mr-2" />
                                                ) : (
                                                  <FileText className="w-5 h-5 mr-2" />
                                                )}
                                                {resource.name} ({resource.type})
                                              </button>
                                            </div>
                                          ))}
                                          {playingVideo &&
                                            section.resources.some((res) => res._id === playingVideo.resourceId) && (
                                              <div className="mt-4">
                                                {playingVideo.resource.sourceType === 'local' ? (
                                                  <video controls className="w-full rounded-lg shadow-sm">
                                                    <source
                                                      src={`http://localhost:5000${playingVideo.resource.path}`}
                                                      type="video/mp4"
                                                    />
                                                    Your browser does not support the video tag.
                                                  </video>
                                                ) : isYouTubeUrl(playingVideo.resource.path) ? (
                                                  <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                                                    <iframe
                                                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                                                      src={getYouTubeEmbedUrl(playingVideo.resource.path)}
                                                      title={playingVideo.resource.name}
                                                      frameBorder="0"
                                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                      allowFullScreen
                                                    ></iframe>
                                                  </div>
                                                ) : (
                                                  <video controls className="w-full rounded-lg shadow-sm">
                                                    <source src={playingVideo.resource.path} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                  </video>
                                                )}
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:w-1/3">
                    <div className="bg-gray-50 rounded-lg p-5 sticky top-6">
                      <h3 className="font-semibold text-lg mb-4">Course Information</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Instructor</h4>
                          <p className="mt-1 text-gray-900">
                            {profile?.firstName} {profile?.lastName || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Subject</h4>
                          <p className="mt-1 text-gray-900">{currentCourse.subject?.name || 'Not specified'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Created</h4>
                          <p className="mt-1 text-gray-900">
                            {currentCourse.createdAt ? new Date(currentCourse.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                          <p className="mt-1 text-gray-900">
                            {currentCourse.updatedAt ? new Date(currentCourse.updatedAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseDetails;