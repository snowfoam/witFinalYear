<template>
  <div>
    <div class="add-btn">
      <Button type="primary" icon="ios-add" @click="openCreateModal"
        >Create Course</Button
      >
    </div>
    <Table border :columns="columns" :data="courses" height="500">
      <template slot-scope="{ row, index }" slot="no">
        <span>{{ index + 1 }}</span>
      </template>
      <template slot-scope="{ row }" slot="action">
        <Button
          type="primary"
          ghost
          size="small"
          style="margin-right: 5px"
          :disabled="userCourses.includes(row._id)"
          @click="openAddModal(row)"
          >add</Button
        >
        <Button
          type="error"
          size="small"
          ghost
          @click="openCancleModal(row)"
          :disabled="!userCourses.includes(row._id)"
          >cancle</Button
        >
      </template>
    </Table>

    <!-- add a new course -->
    <Modal
      v-model="showCreateModal"
      title="course - add"
      :loading="loading"
      @on-ok="create"
    >
      <Form :model="formItem" :label-width="100">
        <FormItem label="Select subject">
          <Select v-model="formItem.subjectId">
            <Option
              v-for="subject in subjects"
              :key="subject._id"
              :value="subject._id"
              >{{ subject.subjectName }}</Option
            >
          </Select>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="showAddModal" width="360">
      <p slot="header" style="color:#2d8cf0;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>course - add</span>
      </p>
      <div style="text-align:center">
        <p>Will you add course: {{ formItem.courseName }}?</p>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="primary" :loading="loading" @click="add">add</Button>
      </div>
    </Modal>

    <Modal v-model="showCancleModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>course - cancle</span>
      </p>
      <div style="text-align:center">
        <p>Will you cancle subject: {{ formItem.courseName }}?</p>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="error" :loading="loading" @click="cancle">cancle</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "courses",
  components: {},
  data() {
    return {
      showCreateModal: false,
      showAddModal: false,
      showCancleModal: false,
      loading: false,
      formItem: {
        subjectId: "",
        courseId: ""
      },
      columns: [
        {
          title: "No",
          slot: "no",
          width: 70
        },
        {
          title: "Course Name",
          key: "courseName"
        },
        {
          title: "Action",
          slot: "action",
          width: 150,
          align: "center"
        }
      ],
      subjects: [],
      courses: [],
      userCourses: []
    };
  },
  methods: {
    ...mapActions([
      "getSubjects",
      "getCourses",
      "getUserCourses",
      "createCourse",
      "addCourse",
      "cancleCourse"
    ]),

    async openCreateModal() {
      this.showCreateModal = true;
      this.formItem.subjectId = "";
    },

    async openAddModal(row) {
      this.showAddModal = true;
      this.formItem.courseName = row.courseName;
      this.formItem.courseId = row._id;
    },

    openCancleModal(row) {
      this.showCancleModal = true;
      this.formItem.courseName = row.courseName;
      this.formItem.courseId = row._id;
    },

    async querySubjects() {
      const { list } = await this.getSubjects();
      this.subjects = list;
    },

    async query() {
      const { list } = await this.getCourses();
      this.courses = list;
    },

    async queryUserCourses() {
      const { list } = await this.getUserCourses();
      this.userCourses = list;
    },

    async create() {
      this.loading = true;
      const { subjectId } = this.formItem;
      const { subjectCode } = this.subjects.find(
        item => item._id === subjectId
      );

      const { success } = await this.createCourse({
        subjectCode,
        subjectId
      });

      if (success) {
        await this.query();
        this.$Message.success("add success");
      } else {
        this.$Message.error("add fail");
      }
      this.loading = false;
    },

    async add() {
      this.loading = true;
      const { success } = await this.addCourse({
        courseId: this.formItem.courseId
      });
      if (success) {
        await this.queryUserCourses();
        this.$Message.success("add success");
      } else {
        this.$Message.error("add fail");
      }
      this.loading = false;
      this.showAddModal = false;
    },

    async cancle() {
      this.loading = true;
      const { success } = await this.cancleCourse({
        courseId: this.formItem.courseId
      });
      if (success) {
        await this.queryUserCourses();
        this.$Message.success("cancle success");
      } else {
        this.$Message.error("cancle fail");
      }
      this.loading = false;
      this.showCancleModal = false;
    }
  },

  async mounted() {
    await this.query();
    await this.queryUserCourses();
    await this.querySubjects();
  }
};
</script>

<style lang="less">
.add-btn {
  margin-bottom: 1rem;
}
</style>
