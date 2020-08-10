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
  getTeacherExams,
  getExamDetailById,
  getExamById,
  applyExam,
  startExam,
  examSubmit,
  cancleExam,
  getStudents,
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
        const { data } = await createSubject(params)
        return data
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async updateSubject({ }, params) {
      try {
        const { data } = await updateSubject(params)
        return data
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async removeSubject({ }, params) {
      try {
        const { data } = await removeSubject(params)
        return data
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async getCourses() {
      try {
        const { data } = await getCourses()
        return { success: true, list: data && data.data || [] }
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
        const { data } = await createCourse(params)
        return data
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async closeCourse({ }, params) {
      try {
        const { data } = await closeCourse(params)
        return data
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async addCourse({ }, params) {
      try {
        const { data } = await addCourse(params)
        return data
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async removeCourse({ }, params) {
      try {
        const { data } = await removeCourse(params)
        return data
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async cancleCourse({ }, params) {
      try {
        const { data } = await cancleCourse(params)
        return data
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
        const { data } = await createQuestion(params)
        return data
      } catch (err) {
        return { success: false, message: err.message }
      }
    },

    async updateQuestion({ }, params) {
      try {
        const { data } = await updateQuestion(params)
        return data
      } catch (err) {
        return { success: false, message: err.message }
      }
    },

    async uploadExcel({ }, params) {
      try {
        const { data } = await uploadExcel(params)
        return data
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async removeQuestion({ }, params) {
      try {
        const { data } = await removeQuestion(params)
        return data
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async getExams({ rootState }) {
      try {
        var userType = rootState.user.userType
        if (userType === 'student') {
          const { data } = await getExams()
          return { success: true, list: data.data }
        } else if (userType === 'teacher') {
          const { data } = await getTeacherExams()
          let list = []
          data.data.forEach(item => {
            if (item.data && item.data.length) {
              list = list.concat(item.data)
            }
          })
          return { success: true, list }
        }

        throw new Error('user type error')
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async getExamDetailById({ }, params) {
      try {
        const { data } = await getExamDetailById(params)
        return data
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async getExamById({ state }, params) {
      try {
        const { data } = await getExamById(params)
        if (data.data) {
          state.exam = data.data.exam
          state.exam.courseName = data.data.courseName
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
        const { data } = await applyExam(params)
        return data
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
        const { data } = await cancleExam(params)
        return data
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    async getStudents({ }, params) {
      try {
        const { data } = await getStudents(params)
        return data
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
  }
}
