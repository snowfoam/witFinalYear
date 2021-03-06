import axios from '@/libs/axios'

export const getSubjects = () => {
  return axios.request({
    url: 'subjects'
  })
}
export const createSubject = (data) => {
  return axios.request({
    url: '/teacher/subject/create',
    data,
    method: 'post'
  })
}
export const updateSubject = (data) => {
  return axios.request({
    url: '/teacher/subject/update',
    data,
    method: 'post'
  })
}
export const removeSubject = (data) => {
  return axios.request({
    url: '/teacher/subject/remove',
    data,
    method: 'post'
  })
}
export const getCourses = () => {
  return axios.request({
    url: 'courses'
  })
}
export const getUserCourses = () => {
  return axios.request({
    url: '/user/courses'
  })
}
export const createCourse = (data) => {
  return axios.request({
    url: '/teacher/course/create',
    data,
    method: 'post'
  })
}
export const closeCourse = (data) => {
  return axios.request({
    url: '/teacher/course/close',
    data,
    method: 'post'
  })
}
export const addCourse = (data) => {
  return axios.request({
    url: '/student/course/apply',
    data,
    method: 'post'
  })
}
export const removeCourse = (data) => {
  return axios.request({
    url: '/course/remove',
    data,
    method: 'post'
  })
}

export const cancleCourse = (data) => {
  return axios.request({
    url: '/student/course/cancle',
    data,
    method: 'post'
  })
}
export const getQuestions = (params) => {
  return axios.request({
    url: '/questions',
    params
  })
}
export const createQuestion = (data) => {
  return axios.request({
    url: '/teacher/question/create',
    data,
    method: 'post'
  })
}
export const updateQuestion = (data) => {
  return axios.request({
    url: '/teacher/question/update',
    data,
    method: 'post'
  })
}
export const uploadExcel = (data) => {
  return axios.request({
    url: '/teacher/question/createByUpload',
    headers: { "Content-Type": "multipart/form-data" },
    data,
    method: 'post'
  })
}
export const removeQuestion = (data) => {
  return axios.request({
    url: '/teacher/question/remove',
    data,
    method: 'post'
  })
}
export const getExams = (data) => {
  return axios.request({
    url: '/student/exam/query'
  })
}
export const getTeacherExams = (data) => {
  return axios.request({
    url: '/teacher/exams'
  })
}
export const getExamDetailById = (params) => {
  return axios.request({
    url: '/teacher/getExamDetailById',
    params,
  })
}
export const getExamById = (params) => {
  return axios.request({
    url: '/student/exam/queryById',
    params
  })
}
export const applyExam = (data) => {
  return axios.request({
    url: '/student/exam/apply',
    data,
    method: 'post'
  })
}
export const startExam = (data) => {
  return axios.request({
    url: '/student/exam/start',
    data,
    method: 'post'
  })
}
export const examSubmit = (data) => {
  return axios.request({
    url: '/student/exam/submit',
    data,
    method: 'post'
  })
}
export const cancleExam = (data) => {
  return axios.request({
    url: '/student/exam/cancle',
    data,
    method: 'post'
  })
}
export const getStudents = (params) => {
  return axios.request({
    url: '/teacher/students',
    params,
  })
}
