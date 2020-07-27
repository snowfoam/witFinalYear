<template>
  <div>
    <div class="add-btn" v-if="isTeacher">
      <Button type="primary" icon="ios-add" @click="openCreateModal"
        >Create Course</Button
      >
    </div>
    <Table border :columns="columns" :data="computedCourses" height="500">
      <template slot-scope="{ row, index }" slot="no">
        <span>{{ index + 1 }}</span>
      </template>
      <template slot-scope="{ row }" slot="action">
        <Button
          type="primary"
          ghost
          size="small"
          style="margin-right: 5px;"
          :disabled="userCourses.includes(row._id)"
          @click="openAddModal(row)"
          v-if="!isTeacher"
          >apply</Button
        >
        <Button
          type="error"
          size="small"
          ghost
          @click="openCancleModal(row)"
          :disabled="
            !userCourses.includes(row._id) ||
            row.status === 'closed' ||
            examCourses.includes(row._id)
          "
          v-if="!isTeacher"
          >cancle</Button
        >
        <Button
          type="error"
          size="small"
          ghost
          @click="openCloseModal(row)"
          :disabled="row.status === 'closed'"
          v-if="isTeacher"
          >close</Button
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
        <FormItem label="course name">
          <Input v-model="formItem.courseName"></Input>
        </FormItem>
        <FormItem label="course desc">
          <Input v-model="formItem.description" type="textarea"></Input>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="showAddModal" width="360">
      <p slot="header" style="color: #2d8cf0; text-align: center;">
        <Icon type="ios-information-circle"></Icon>
        <span>course - apply</span>
      </p>
      <div style="text-align: center;">
        <p>Will you apply course: {{ formItem.courseName }}?</p>
      </div>
      <div slot="footer" style="text-align: center;">
        <Button type="primary" :loading="loading" @click="add">apply</Button>
      </div>
    </Modal>

    <Modal v-model="showCancleModal" width="360">
      <p slot="header" style="color: #f60; text-align: center;">
        <Icon type="ios-information-circle"></Icon>
        <span>course - cancle</span>
      </p>
      <div style="text-align: center;">
        <p>Will you cancle subject: {{ formItem.courseName }}?</p>
      </div>
      <div slot="footer" style="text-align: center;">
        <Button type="error" :loading="loading" @click="cancle">cancle</Button>
      </div>
    </Modal>

    <Modal v-model="showCloseModal" width="360">
      <p slot="header" style="color: #f60; text-align: center;">
        <Icon type="ios-information-circle"></Icon>
        <span>course - close</span>
      </p>
      <div style="text-align: center;">
        <p>Will you close subject: {{ formItem.courseName }}?</p>
      </div>
      <div slot="footer" style="text-align: center;">
        <Button type="error" :loading="loading" @click="close">close</Button>
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
      showCloseModal: false,
      loading: false,
      formItem: {
        subjectId: "",
        courseId: "",
        courseName: "",
        description: "",
      },
      columns: [
        {
          title: "No",
          slot: "no",
          width: 70,
        },
        {
          title: "subject Name",
          key: "subjectName",
        },
        {
          title: "Course Name",
          key: "courseName",
        },
        {
          title: "teacher Name",
          key: "teacherName",
        },
        {
          title: "Course Description",
          width: 300,
          key: "description",
        },
        {
          title: "Action",
          slot: "action",
          width: 150,
          align: "center",
        },
      ],
      subjects: [],
      courses: [],
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
    examCourses() {
      return this.$store.state.user.userInfo.examCourses || [];
    },
    computedCourses() {
      return this.isTeacher
        ? this.courses.filter((item) => {
            return this.userCourses.includes(item._id);
          })
        : this.courses;
    },
  },
  methods: {
    ...mapActions([
      "getSubjects",
      "getCourses",
      "getUserCourses",
      "createCourse",
      "closeCourse",
      "addCourse",
      "cancleCourse",
    ]),

    async openCreateModal() {
      this.showCreateModal = true;
      this.formItem.subjectId = "";
      this.formItem.courseName = "";
      this.formItem.description = "";
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

    openCloseModal(row) {
      this.showCloseModal = true;
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
      const { subjectId, courseName, description } = this.formItem;
      const { subjectCode } = this.subjects.find(
        (item) => item._id === subjectId
      );

      const { success } = await this.createCourse({
        subjectCode,
        subjectId,
        courseName,
        description,
      });

      if (success) {
        await this.query();
        await this.queryUserCourses();
        this.$Message.success("add success");
      } else {
        this.$Message.error("add fail");
      }
      this.loading = false;
      this.showCreateModal = false;
    },

    async close() {
      this.loading = true;
      const { courseId } = this.formItem;
      const { success } = await this.closeCourse({
        courseId,
      });

      if (success) {
        await this.query();
        this.$Message.success("close success");
      } else {
        this.$Message.error("close fail");
      }
      this.loading = false;
      this.showCloseModal = false;
    },

    async add() {
      this.loading = true;
      const { success } = await this.addCourse({
        courseId: this.formItem.courseId,
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
        courseId: this.formItem.courseId,
      });
      if (success) {
        await this.queryUserCourses();
        this.$Message.success("cancle success");
      } else {
        this.$Message.error("cancle fail");
      }
      this.loading = false;
      this.showCancleModal = false;
    },
  },

  async mounted() {
    await this.query();
    await this.queryUserCourses();
    await this.querySubjects();
  },
};
</script>

<style lang="less">
.add-btn {
  margin-bottom: 1rem;
}
</style>
