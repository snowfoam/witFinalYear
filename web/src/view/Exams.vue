<template>
  <div>
    <div class="add-btn">
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
        <Button
          type="primary"
          ghost
          size="small"
          style="margin-right: 5px"
          :disabled="row.status !== 'nostart'"
          @click="openStartModal(row)"
          >start</Button
        >
        <Button
          type="error"
          size="small"
          ghost
          :disabled="row.status !== 'nostart'"
          @click="openCancleModal(row)"
          >cancle</Button
        >
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
              v-for="course in courses"
              :key="course._id"
              :value="course._id"
              :disabled="
                exams.find(
                  item =>
                    item.courseId === course._id && item.status !== 'cancled'
                )
              "
              >{{ course.courseName }}</Option
            >
          </Select>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="showCancleModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>exam - cancle</span>
      </p>
      <div style="text-align:center">
        <p>Will you cancle exam: {{ courseObject[formItem.courseId] }}?</p>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="error" :loading="loading" @click="cancle">cancle</Button>
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
      courses: [],
      courseObject: {},
      exams: [],
      columns: [
        {
          title: "No",
          slot: "no",
          width: 70
        },
        {
          title: "course name",
          slot: "course",
          align: "center"
        },
        {
          title: "duration(Min)",
          key: "duration"
        },
        {
          title: "status",
          key: "status"
        },
        {
          title: "apply time",
          key: "createTime",
          slot: "createTime"
        },
        {
          title: "begin time",
          key: "beginTime",
          slot: "beginTime"
        },
        {
          title: "end time",
          key: "endTime",
          slot: "endTime"
        },
        {
          title: "score",
          key: "score"
        },
        {
          title: "Action",
          slot: "action",
          width: 150,
          align: "center"
        }
      ],
      formItem: {
        courseId: ""
      }
    };
  },
  methods: {
    ...mapActions(["getExams", "getCourses", "applyExam", "cancleExam"]),

    dateFormat(date) {
      return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    },

    async query() {
      const { list } = await this.getExams();
      this.exams = list;
    },

    async queryCourses() {
      const { list } = await this.getCourses();
      this.courses = list;
      list.forEach(item => {
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

    async apply() {
      this.loading = true;
      const { courseId } = this.formItem;
      const { success } = await this.applyExam({ courseId });

      if (success) {
        await this.query();
        this.$Message.success("apply success");
      } else {
        this.$Message.error("apply fail");
      }
      this.loading = false;
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
    }
  },

  async mounted() {
    await this.queryCourses();
    await this.query();
  }
};
</script>

<style lang="less">
.add-btn {
  margin-bottom: 1rem;
}
</style>
