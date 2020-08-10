<template>
  <div>
    <Form ref="formInline" :model="formInline" inline>
      <FormItem prop="Student Name">
        <Select
          clearable
          v-model="formInline.studentId"
          style="width: 200px;"
          placeholder="student name"
        >
          <Option
            v-for="(value, key) in studentObject"
            :key="`student-${key}`"
            :value="key"
            >{{ value }}</Option
          >
        </Select>
      </FormItem>
      <FormItem prop="Course Name">
        <Select
          clearable
          v-model="formInline.courseId"
          style="width: 200px;"
          placeholder="course name"
        >
          <Option
            v-for="(value, key) in courseObject"
            :key="`course-${key}`"
            :value="key"
            >{{ value }}</Option
          >
        </Select>
      </FormItem>
      <FormItem>
        <Button @click="filter" type="primary" style="margin-right: 8px;"
          >search</Button
        >
        <Button @click="exportData"
          ><Icon type="ios-download-outline"></Icon> Export source data</Button
        >
      </FormItem>
    </Form>
    <Table
      border
      :columns="columns"
      :data="displayExams"
      height="500"
      ref="table"
    >
      <template slot-scope="{ row, index }" slot="no">
        <span>{{ row.no }}</span>
      </template>
      <template slot-scope="{ row }" slot="course">
        <span>{{ row.course }}</span>
      </template>
      <template slot-scope="{ row }" slot="student">
        <span>{{ row.student }}</span>
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
    </Table>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import dayjs from "dayjs";
import { cloneDeep } from "lodash";

export default {
  name: "students",
  components: {},
  data() {
    return {
      formInline: {
        studentId: "",
        courseId: "",
      },
      courseObject: {},
      columns: [
        {
          title: "No",
          key: "no",
          slot: "no",
          width: 70,
        },
        {
          title: "course",
          key: "course",
          slot: "course",
          align: "center",
          sortable: true,
        },
        {
          title: "student",
          key: "student",
          slot: "student",
          align: "center",
          sortable: true,
        },
        {
          title: "status",
          key: "status",
          sortable: true,
        },
        {
          title: "apply time",
          key: "createTime",
          slot: "createTime",
          sortable: true,
        },
        {
          title: "begin time",
          key: "beginTime",
          slot: "beginTime",
          sortable: true,
        },
        {
          title: "end time",
          key: "endTime",
          slot: "endTime",
          sortable: true,
        },
        {
          title: "score",
          key: "score",
          sortable: true,
        },
      ],
      exams: [],
      displayExams: [],
      studentObject: {},
    };
  },
  methods: {
    ...mapActions(["getStudents", "getCourses"]),
    dateFormat(date) {
      return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    },
    async queryCourses() {
      const { list } = await this.getCourses();
      this.courses = list;
      list.forEach((item) => {
        this.courseObject[item._id] = item.courseName;
      });
    },
    filter() {
      const { studentId, courseId } = this.formInline;
      const list = this.exams.filter((item) => {
        if (studentId && !courseId) {
          return item.studentId === studentId;
        } else if (!studentId && courseId) {
          return item.courseId === courseId;
        } else if (studentId && courseId) {
          return item.studentId === studentId && item.courseId === courseId;
        }
        return item;
      });
      this.setDisplayExams(list);
    },
    exportData() {
      const now = dayjs().format("YYYYMMDDHHmmss");

      this.$refs.table.exportCsv({
        filename: `[OES]students-${now}`,
        original: false,
      });
    },
    setDisplayExams(list) {
      this.displayExams = list.map((item, index) => {
        item.no = index + 1;
        item.course = this.courseObject[item.courseId];
        item.student = this.studentObject[item.studentId];
        return item;
      });
    },
  },
  async mounted() {
    await this.queryCourses();
    const res = await this.getStudents();
    if (res && res.data) {
      this.exams = res.data.list;
      this.studentObject = res.data.studentObject;
      this.setDisplayExams(this.exams);
    }
  },
};
</script>

<style lang="less">
</style>
