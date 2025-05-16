import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseDetails } from '../../redux/actions/studentActions';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Notification from '../../components/common/Notification';
import { 
  ArrowLeft, 
  PlayCircle, 
  FileText, 
  ChevronDown, 
  ChevronRight, 
  Clock,
  BookOpen,
  File,
  Link as LinkIcon,
  User,
  Calendar,
  RefreshCw,
  Layers,
  FileStack
} from 'lucide-react';

const CourseDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentCourse, error } = useSelector((state) => state.student);
  const [expandedModules, setExpandedModules] = useState({});
  const [playingVideo, setPlayingVideo] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      dispatch(getCourseDetails(id))
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [dispatch, id]);

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
    } else if (resource.type === 'pdf' || resource.type === 'file') {
      const backendBaseUrl = 'http://localhost:5000';
      let fileUrl = resource.path;
  
      if (!fileUrl.startsWith('http')) {
        fileUrl = `${backendBaseUrl}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
      } else if (fileUrl.startsWith('http://localhost:5000/uploads/')) {
        fileUrl = resource.path;
      }
  
      window.open(fileUrl, '_blank');
    } else if (resource.type === 'link') {
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

  const getResourceIcon = (type) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="w-5 h-5 text-red-500" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'file':
        return <File className="w-5 h-5 text-purple-500" />;
      case 'link':
        return <LinkIcon className="w-5 h-5 text-teal-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar expanded={expanded} setExpanded={setExpanded} />
        <div className="flex-1 flex flex-col">
          <Header expanded={expanded} setExpanded={setExpanded} />
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !currentCourse || currentCourse._id !== id) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar expanded={expanded} setExpanded={setExpanded} />
        <div className="flex-1 flex flex-col">
          <Header expanded={expanded} setExpanded={setExpanded} />
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
              <p className="text-red-600">{error || 'Course not found'}</p>
              <button
                onClick={() => navigate('/student/courses')}
                className="mt-4 flex items-center text-teal-600 hover:text-teal-800 font-medium"
              >
                <ArrowLeft className="w-5 h-5 mr-1" /> Back to Courses
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${expanded ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <Header expanded={expanded} setExpanded={setExpanded} />
        <main className="flex-1 p-6 lg:p-8 pt-20 lg:pt-16">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate('/student/courses')}
              className="mb-6 flex items-center text-teal-600 hover:text-teal-800 font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back to Courses
            </button>
            
            {/* Course Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="relative">
                <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <div className="absolute -bottom-10 left-8">
                  <div className="h-20 w-20 rounded-xl bg-white shadow-md flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-indigo-600" />
                  </div>
                </div>
              </div>
              <div className="p-8 pt-14">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{currentCourse.name}</h1>
                    <p className="mt-2 text-gray-600">{currentCourse.description || 'No description provided'}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {currentCourse.subject?.name || 'No subject'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Course Modules</h2>
                  </div>
                  
                  {currentCourse.modules.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="text-gray-400 mb-4">No modules available for this course yet.</div>
                      <button 
                        className="text-teal-600 hover:text-teal-800 font-medium"
                        onClick={() => window.location.reload()}
                      >
                        <RefreshCw className="w-4 h-4 inline mr-1" /> Check again
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {currentCourse.modules.map((module, moduleIndex) => (
                        <div key={module._id} className="group">
                          <button
                            onClick={() => toggleModule(module._id)}
                            className="w-full flex justify-between items-center p-6 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start">
                              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-50 text-indigo-700 mr-4">
                                {moduleIndex + 1}
                              </div>
                              <div className="text-left">
                                <h3 className="text-lg font-medium text-gray-900">{module.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{module.description || 'No description'}</p>
                                <div className="mt-2 flex items-center text-xs text-gray-500">
                                  <Layers className="w-3 h-3 mr-1" />
                                  <span>{module.sections.length} sections</span>
                                </div>
                              </div>
                            </div>
                            {expandedModules[module._id] ? (
                              <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                            )}
                          </button>
                          
                          {expandedModules[module._id] && (
                            <div className="bg-gray-50">
                              {module.sections.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">No sections available.</div>
                              ) : (
                                module.sections.map((section, sectionIndex) => (
                                  <div key={section._id} className="p-6 pt-4 border-t border-gray-200">
                                    <div className="flex items-start mb-4">
                                      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-teal-50 text-teal-700 text-xs font-medium mr-3">
                                        {moduleIndex + 1}.{sectionIndex + 1}
                                      </div>
                                      <div>
                                        <h4 className="text-md font-semibold text-gray-900">{section.name}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{section.description || 'No description'}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="ml-11 space-y-3">
                                      {section.resources.map((resource) => (
                                        <div 
                                          key={resource._id} 
                                          className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors bg-white hover:bg-gray-100 border border-gray-200"
                                          onClick={() => handleResourceClick(resource)}
                                        >
                                          <div className="flex items-center">
                                            <div className="mr-3">
                                              {getResourceIcon(resource.type)}
                                            </div>
                                            <div>
                                              <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                                {resource.type} 
                                                {resource.duration && (
                                                  <>
                                                    <span className="mx-2">•</span>
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    <span>{formatDuration(resource.duration)}</span>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                      
                                      {playingVideo && section.resources.some((res) => res._id === playingVideo.resourceId) && (
                                        <div className="mt-4">
                                          {isYouTubeUrl(playingVideo.resource.path) ? (
                                            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                                              <iframe
                                                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-sm"
                                                src={getYouTubeEmbedUrl(playingVideo.resource.path)}
                                                title={playingVideo.resource.name}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                              ></iframe>
                                            </div>
                                          ) : (
                                            <video 
                                              controls 
                                              className="w-full rounded-lg shadow-sm"
                                            >
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
              
              {/* Sidebar */}
              <div className="lg:w-1/3 space-y-6">
                {/* Instructor Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Instructor</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold mr-4">
                        {currentCourse.teacherId?.firstName?.charAt(0)}{currentCourse.teacherId?.lastName?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {currentCourse.teacherId?.firstName} {currentCourse.teacherId?.lastName}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">Course Instructor</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Course Details Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Course Details</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 mr-4">
                          <FileStack className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-600">Modules</h4>
                          <p className="text-gray-900">{currentCourse.modules.length}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-teal-50 text-teal-600 mr-4">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-600">Sections</h4>
                          <p className="text-gray-900">
                            {currentCourse.modules.reduce((total, mod) => total + (mod.sections?.length || 0), 0)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-4">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-600">Created</h4>
                          <p className="text-gray-900">
                            {currentCourse.createdAt ? new Date(currentCourse.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-amber-50 text-amber-600 mr-4">
                          <RefreshCw className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-600">Last Updated</h4>
                          <p className="text-gray-900">
                            {currentCourse.updatedAt ? new Date(currentCourse.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'N/A'}
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
      <Notification />
    </div>
  );
};

export default CourseDetails;