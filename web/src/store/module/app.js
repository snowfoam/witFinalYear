import {
  getSubjects,
  createSubject,
  updateSubject,
  removeSubject,
  getCourses,
  getUserCourses,
  createCourse,
  closeCourse,
  addCourse,
  cancleCourse,
  removeCourse,
  getQuestions,
  createQuestion,
  updateQuestion,
  uploadExcel,
  removeQuestion,
  getExams,
  getExamById,
  applyExam,
  startExam,
  examSubmit,
  cancleExam,
} from '@/api/app'

export default {
  state: {
    exam: {},
  },
  getters: {},
  mutations: {},
  actions: {
    async getSubjects() {
      try {
        const { data } = await getSubjects()
        return { success: true, list: data.data }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async createSubject({ }, params) {
      try {
        const { data: { success, message } } = await createSubject(params)
        return { success, message }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async updateSubject({ }, params) {
      try {
        const { data: { success, message } } = await updateSubject(params)
        return { success, message }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async removeSubject({ }, params) {
      try {
        const { data: { success, message } } = await removeSubject(params)
        return { success, message }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async getCourses() {
      try {
        const { data } = await getCourses()
        return { success: true, list: data.data }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async getUserCourses({ }, params) {
      try {
        const { data, examCourses } = await getUserCourses()
        return { success: true, list: data.data, examCourses: examCourses || [] }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async createCourse({ }, params) {
      try {
        const { data: { success, message } } = await createCourse(params)
        return { success, message }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async closeCourse({ }, params) {
      try {
        const { data: { success, message } } = await closeCourse(params)
        return { success, message }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async addCourse({ }, params) {
      try {
        const { data: { success, message } } = await addCourse(params)
        return { success, message }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async removeCourse({ }, params) {
      try {
        const { data: { success, message } } = await removeCourse(params)
        return { success, message }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async cancleCourse({ }, params) {
      try {
        const { data: { success, message } } = await cancleCourse(params)
        return { success, message }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async getQuestions({ }, params) {
      try {
        const { data } = await getQuestions(params)
        return { success: true, list: data.data }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },

    async createQuestion({ }, params) {
      try {
        const { data: { success, message } } = await createQuestion(params)
        return { success, message }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },

    async updateQuestion({ }, params) {
      try {
        const { data: { success, message } } = await updateQuestion(params)
        return { success, message }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },

    async uploadExcel({ }, params) {
      try {
        const { data: { success, message } } = await uploadExcel(params)
        return { success, message }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async removeQuestion({ }, params) {
      try {
        const { data: { success, message } } = await removeQuestion(params)
        return { success, message }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async getExams() {
      try {
        const { data } = await getExams()
        return { success: true, list: data.data }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async getExamById({ state }, params) {
      try {
        const { data } = await getExamById(params)
        if (data.data) {
          state.exam = data.data
          return { success: true, data: data.data }
        } else {
          return { success: false, message: err.message }
        }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async applyExam({ }, params) {
      try {
        const { data: { success, message } } = await applyExam(params)
        return { success, message }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async startExam({ state }, params) {
      try {
        const { data } = await startExam(params)
        state.exam = data.data
        return { success: true, data: data.data }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async examSubmit({ }, params) {
      try {
        const { data } = await examSubmit(params)
        return { success: true, data: data.data }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async cancleExam({ }, params) {
      try {
        const { data: { success, message } } = await cancleExam(params)
        return { success, message }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
  }
}
