<template>
  <div>
    <div class="add-btn" v-if="!isTeacher">
      <Button type="primary" icon="ios-add" @click="openApplyModal"
        >apply exam</Button
      >
    </div>

    <Table border :columns="columns" :data="exams" height="500">
      <template slot-scope="{ row, index }" slot="no">
        <span>{{ index + 1 }}</span>
      </template>
      <template slot-scope="{ row }" slot="course">
        <span>{{ courseObject[row.courseId] }}</span>
      </template>
      <template slot-scope="{ row }" slot="createTime">
        <span>{{ dateFormat(row.createTime) }}</span>
      </template>
      <template slot-scope="{ row }" slot="beginTime">
        <span>{{ row.beginTime ? dateFormat(row.beginTime) : "" }}</span>
      </template>
      <template slot-scope="{ row }" slot="endTime">
        <span>{{ row.endTime ? dateFormat(row.endTime) : "" }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <template v-if="isTeacher">
          <Button
            type="primary"
            ghost
            size="small"
            style="margin-right: 5px;"
            @click="openDetailModal(row)"
            >detail</Button
          >
        </template>
        <template v-else>
          <Button
            type="primary"
            ghost
            size="small"
            style="margin-right: 5px;"
            v-if="row.status === 'nostart'"
            @click="openStartModal(row)"
            >start</Button
          >
          <Button
            type="primary"
            ghost
            size="small"
            style="margin-right: 5px;"
            v-if="row.status === 'processing'"
            @click="$router.push(`/exam/${row._id}`)"
            >processing</Button
          >
          <Button
            type="primary"
            ghost
            size="small"
            style="margin-right: 5px;"
            v-else-if="row.status === 'ended'"
            @click="$router.push(`/exam/${row._id}`)"
            >detail</Button
          >
          <Button
            type="error"
            size="small"
            ghost
            v-if="row.status === 'nostart'"
            @click="openCancleModal(row)"
            >cancle</Button
          >
        </template>
      </template>
    </Table>

    <Modal
      v-model="showApplyModal"
      title="exam - apply"
      :loading="loading"
      @on-ok="apply"
    >
      <Form :model="formItem" :label-width="100">
        <FormItem label="Select subject">
          <Select v-model="formItem.courseId">
            <Option
              v-for="course in courses.filter((item) => item.status === 'open')"
              :key="course._id"
              :value="course._id"
              :disabled="
                !!exams.find(
                  (item) =>
                    item.courseId === course._id &&
                    !['cancled', 'course-closed'].includes(item.status)
                )
              "
              >{{ course.courseName }}</Option
            >
          </Select>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="showStartModal" width="360">
      <p slot="header" style="color: #2d8cf0; text-align: center;">
        <Icon type="ios-information-circle"></Icon>
        <span>exam - start</span>
      </p>
      <div style="text-align: center;">
        <p>
          Will you start the exam of course:
          {{ courseObject[formItem.courseId] }}?
        </p>
      </div>
      <div slot="footer" style="text-align: center;">
        <Button type="primary" :loading="loading" @click="start">start</Button>
      </div>
    </Modal>

    <Modal v-model="showCancleModal" width="360">
      <p slot="header" style="color: #f60; text-align: center;">
        <Icon type="ios-information-circle"></Icon>
        <span>exam - cancle</span>
      </p>
      <div style="text-align: center;">
        <p>Will you cancle exam: {{ courseObject[formItem.courseId] }}?</p>
      </div>
      <div slot="footer" style="text-align: center;">
        <Button type="error" :loading="loading" @click="cancle">cancle</Button>
      </div>
    </Modal>

    <Modal v-model="showDetailModal" title="exam details" footer-hide>
      <p>studentName: {{ exam.studentName }}</p>
      <p>studentEmail: {{ exam.studentEmail }}</p>
      <p>studentId: {{ exam.studentId }}</p>
      <p>courseId: {{ exam.courseId }}</p>
      <p>createTime: {{ exam.createTime }}</p>
      <p>beginTime: {{ exam.beginTime }}</p>
      <p>endTime: {{ exam.endTime }}</p>
      <p>status: {{ exam.status }}</p>
      <p>score: {{ exam.score }}</p>
      <p>duration: {{ exam.duration }}</p>
      <p>teacherId: {{ exam.teacherId }}</p>
      <p>teacherName: {{ exam.teacherName }}</p>
      <p>subjectName: {{ exam.subjectName }}</p>
      <p>description: {{ exam.description }}</p>
      <p>courseName: {{ exam.courseName }}</p>
      <p>subjectId: {{ exam.subjectId }}</p>
      <div
        v-for="(question, index) in exam.questions"
        :key="index"
        class="question"
      >
        <div class="index">{{ index + 1 }}.</div>
        <div class="article">
          <div class="desc">{{ question.article }}</div>
          <div v-if="question.type === 'multiple'">
            <CheckboxGroup v-model="question.answer.toString()">
              <Checkbox
                :label="option + ''"
                v-for="(option, i) in question.options"
                :key="`${index}-${i}`"
              ></Checkbox>
            </CheckboxGroup>
          </div>
          <div v-else>
            <RadioGroup v-model="question.answer.toString()">
              <Radio
                :label="option + ''"
                v-for="(option, i) in question.options"
                :key="`${index}-${i}`"
              ></Radio>
            </RadioGroup>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import dayjs from "dayjs";

export default {
  name: "exams",
  data() {
    return {
      loading: false,
      showApplyModal: false,
      showStartModal: false,
      showCancleModal: false,
      showDetailModal: false,
      exam: {},
      courses: [],
      courseObject: {},
      exams: [],
      columns: [
        {
          title: "No",
          slot: "no",
          width: 70,
        },
        {
          title: "course name",
          slot: "course",
          align: "center",
        },
        {
          title: "duration(min)",
          key: "duration",
        },
        {
          title: "status",
          key: "status",
        },
        {
          title: "apply time",
          key: "createTime",
          slot: "createTime",
        },
        {
          title: "begin time",
          key: "beginTime",
          slot: "beginTime",
        },
        {
          title: "end time",
          key: "endTime",
          slot: "endTime",
        },
        {
          title: "score",
          key: "score",
        },
        {
          title: "action",
          slot: "action",
          width: 150,
          align: "center",
        },
      ],
      formItem: {
        courseId: "",
      },
      userCourses: [],
    };
  },
  computed: {
    userType() {
      return this.$store.state.user.userType;
    },
    isTeacher() {
      return this.userType === "teacher";
    },
  },
  methods: {
    ...mapActions([
      "getExams",
      "getExamDetailById",
      "getCourses",
      "getUserCourses",
      "applyExam",
      "startExam",
      "cancleExam",
    ]),

    dateFormat(date) {
      return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    },

    async query() {
      const { list } = await this.getExams();
      this.exams = list || [];
    },

    async queryUserCourses() {
      const { list } = await this.getUserCourses();
      this.userCourses = list;
    },

    async queryCourses() {
      const { list } = await this.getCourses();
      this.courses = list;
      list.forEach((item) => {
        this.courseObject[item._id] = item.courseName;
      });
    },

    async openApplyModal() {
      this.showApplyModal = true;
      this.formItem.courseId = "";
    },

    async openStartModal(row) {
      this.showStartModal = true;
      this.formItem = row;
    },

    async openCancleModal(row) {
      this.showCancleModal = true;
      this.formItem = row;
    },

    async openDetailModal(row) {
      const res = await this.getExamDetailById({ examId: row._id });
      this.exam = res.data;
      this.showDetailModal = true;
    },

    async apply() {
      this.loading = true;
      const { courseId } = this.formItem;
      const { success } = await this.applyExam({ courseId });

      if (success) {
        await this.$store.dispatch("getUserInfo");
        await this.query();
        this.$Message.success("apply success");
      } else {
        this.$Message.error("apply fail");
      }
      this.loading = false;
    },

    async start() {
      const { _id: examId, courseId } = this.formItem;
      const courseName = this.courseObject[courseId];
      this.loading = true;
      const { success } = await this.startExam({ examId, courseName });

      if (success) {
        const exam = this.exams.find((item) => item._id === examId);
        exam.status = "processing";
        this.$Message.success({
          content: "start success, the page would redirect",
          onClose: () => {
            this.$router.push(`/exam/${examId}`);
          },
        });
      } else {
        this.$Message.error("start fail");
      }

      this.loading = false;
      this.showStartModal = false;
    },

    async cancle() {
      this.loading = true;
      const { _id: examId } = this.formItem;
      const { success } = await this.cancleExam({ examId });

      if (success) {
        await this.query();
        this.$Message.success("cancle success");
      } else {
        this.$Message.error("cancle fail");
      }
      this.loading = false;
      this.showCancleModal = false;
    },
  },

  async mounted() {
    await this.queryUserCourses();
    await this.queryCourses();
    await this.query();
  },
};
</script>

<style lang="less">
.add-btn {
  margin-bottom: 1rem;
}
.question {
  display: flex;
  margin: 1rem 0 0 0;
}
.index {
  width: 20px;
}
</style>
