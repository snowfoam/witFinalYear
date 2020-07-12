import {
  getSubjects,
  createSubject,
  updateSubject,
  removeSubject,
  getCourses,
  getUserCourses,
  createCourse,
  addCourse,
  cancleCourse,
  removeCourse,
  getQuestions,
  createQuestion,
  updateQuestion,
  removeQuestion,
  getExams,
  applyExam,
  cancleExam,
} from '@/api/app'

export default {
  state: {},
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
        await createSubject(params)
        return { success: true, message: '' }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async updateSubject({ }, params) {
      try {
        await updateSubject(params)
        return { success: true, message: '' }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async removeSubject({ }, params) {
      try {
        await removeSubject(params)
        return { success: true, message: '' }
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
        const { data } = await getUserCourses()
        return { success: true, list: data.data }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async createCourse({ }, params) {
      try {
        await createCourse(params)
        return { success: true, message: '' }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async addCourse({ }, params) {
      try {
        await addCourse(params)
        return { success: true, message: '' }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async removeCourse({ }, params) {
      try {
        await removeCourse(params)
        return { success: true, message: '' }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async cancleCourse({ }, params) {
      try {
        await cancleCourse(params)
        return { success: true, message: '' }
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
        await createQuestion(params)
        return { success: true, message: '' }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },

    async updateQuestion({ }, params) {
      try {
        await updateQuestion(params)
        return { success: true, message: '' }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },

    async removeQuestion({ }, params) {
      try {
        await removeQuestion(params)
        return { success: true, message: '' }
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
    async applyExam({ }, params) {
      try {
        await applyExam(params)
        return { success: true, message: '' }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async cancleExam({ }, params) {
      try {
        await cancleExam(params)
        return { success: true, message: '' }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
  }
}
