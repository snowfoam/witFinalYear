<template>
  <div>
    <Form ref="formInline" :model="formInline" inline>
      <FormItem prop="Subject Type">
        <Select
          clearable
          v-model="formInline.subjectId"
          style="width: 200px;"
          placeholder="subject type"
        >
          <Option
            v-for="subject in subjects"
            :key="subject._id"
            :value="subject._id"
            >{{ subject.subjectName }}</Option
          >
        </Select>
      </FormItem>
      <FormItem prop="Question Type">
        <Select
          clearable
          v-model="formInline.type"
          style="width: 200px;"
          placeholder="question type"
        >
          <Option value="single">single</Option>
          <Option value="multiple">multiple</Option>
          <Option value="trueOrFalse">trueOrFalse</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button @click="query" style="margin-right: 8px;">search</Button>
        <Button
          icon="ios-cloud-upload-outline"
          @click="openUploadModal"
          style="margin-right: 8px;"
          >Create(Excel)</Button
        >
        <Button type="primary" icon="ios-add" @click="openCreateModal"
          >Create</Button
        >
      </FormItem>
    </Form>

    <Table border :columns="columns" :data="questions" height="500">
      <template slot-scope="{ row, index }" slot="no">
        <span>{{ index + 1 }}</span>
      </template>
      <template slot-scope="{ row }" slot="subject">
        <span>{{ subjectObject[row.subjectId] }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button
          type="primary"
          ghost
          size="small"
          style="margin-right: 5px;"
          @click="openUpdateModal(row)"
          >edit</Button
        >
        <Button
          type="error"
          size="small"
          ghost
          @click="openDeleteModal(row, index + 1)"
          >delete</Button
        >
      </template>
    </Table>

    <Modal
      v-model="showCreateOrUpdateModal"
      :title="`question - ${modalType}`"
      :loading="loading"
      @on-ok="handleOnOk"
    >
      <Form :model="formItem" :label-width="140">
        <FormItem label="question desc">
          <Input v-model="formItem.article" type="textarea"></Input>
        </FormItem>
        <FormItem label="Subject Type">
          <Select
            clearable
            v-model="formItem.subjectId"
            style="width: 200px;"
            placeholder="subject type"
          >
            <Option
              v-for="subject in subjects"
              :key="subject._id"
              :value="subject._id"
              >{{ subject.subjectName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="Question Type">
          <Select
            clearable
            v-model="formItem.type"
            style="width: 200px;"
            placeholder="question type"
            @on-change="onChange"
          >
            <Option value="single">single</Option>
            <Option value="multiple">multiple</Option>
            <Option value="trueOrFalse">trueOrFalse</Option>
          </Select>
        </FormItem>
        <FormItem label="Options">
          <Tag
            v-for="item in formItem.options"
            :key="`${item}`"
            :name="`${item}`"
            :closable="formItem.type !== 'trueOrFalse'"
            @on-close="handleClose"
            >{{ item }}</Tag
          >
          <Input
            v-if="inputVisible"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            ref="saveTagInput"
            @on-blur="handleInputConfirm"
          ></Input>

          <Button
            icon="ios-add"
            type="dashed"
            size="small"
            :disabled="formItem.type === 'trueOrFalse'"
            @click="showInput"
            v-else
          />
        </FormItem>
        <FormItem label="Answer">
          <Select
            clearable
            :multiple="formItem.type === 'multiple'"
            v-model="formItem.answer"
            style="width: 200px;"
            placeholder="anwser"
          >
            <Option
              v-for="item in formItem.options"
              :key="item"
              :value="item"
              >{{ item }}</Option
            >
          </Select>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="showUploadModal" width="460">
      <p slot="header" style="text-align: center;">
        <Icon type="ios-information-circle"></Icon>
        <span>question - upload excel</span>
      </p>
      <Form :model="formItem" :label-width="140">
        <FormItem label="Subject Type">
          <Select
            clearable
            v-model="formItem.subjectId"
            style="width: 200px;"
            placeholder="subject type"
          >
            <Option
              v-for="subject in subjects"
              :key="subject._id"
              :value="subject._id"
              >{{ subject.subjectName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="Question Type">
          <Upload
            :before-upload="handleUpload"
            action="/teacher/question/createByUpload"
          >
            <Button icon="ios-cloud-upload-outline"
              >Select the file to upload</Button
            >
          </Upload>
          <div v-if="file !== null">
            Upload file: {{ file.name }}
            <Button type="text" @click="upload" :loading="loading">{{
              loading ? "Uploading" : "Click to upload"
            }}</Button>
          </div>
        </FormItem>
      </Form>

      <div slot="footer"></div>
    </Modal>

    <Modal v-model="showDeleteModal" width="360">
      <p slot="header" style="color: #f60; text-align: center;">
        <Icon type="ios-information-circle"></Icon>
        <span>question - delete</span>
      </p>
      <div style="text-align: center;">
        <p>Will you delete question: {{ questionNo }}?</p>
      </div>
      <div slot="footer" style="text-align: center;">
        <Button type="error" :loading="loading" @click="remove">delete</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { cloneDeep } from "lodash";
export default {
  name: "questions",
  data() {
    return {
      formInline: {
        subjectId: "",
        type: "",
      },
      subjects: [],
      questionNo: "",
      subjectObject: {},
      questions: [],
      inputVisible: false,
      inputValue: "",
      modalType: "create", // create | update
      showCreateOrUpdateModal: false,
      showDeleteModal: false,
      showUploadModal: false,
      file: null,
      loading: false,
      formItem: {
        type: "",
        article: "",
        options: [],
        answer: [],
        subjectId: "",
      },
      columns: [
        {
          title: "No",
          slot: "no",
          width: 70,
        },
        {
          title: "Desc",
          key: "article",
        },
        {
          title: "QuestionType",
          key: "type",
        },
        {
          title: "SubjectType",
          slot: "subject",
          align: "center",
        },
        {
          title: "Action",
          slot: "action",
          width: 150,
          align: "center",
        },
      ],
    };
  },
  methods: {
    ...mapActions([
      "getSubjects",
      "getQuestions",
      "createQuestion",
      "updateQuestion",
      "uploadExcel",
      "removeQuestion",
    ]),
    openCreateModal() {
      this.modalType = "create";
      this.showCreateOrUpdateModal = true;
      this.formItem = {
        type: "",
        article: "",
        options: [],
        answer: [],
        subjectId: "",
      };
    },

    openUpdateModal(row) {
      this.modalType = "update";
      this.showCreateOrUpdateModal = true;
      const cRow = cloneDeep(row);
      if (Array.isArray(cRow.options)) {
        cRow.options = cRow.options.map((item) => {
          if (typeof item === "boolean") {
            return String(item);
          }
        });
      }
      if (typeof cRow.answer === "boolean") {
        cRow.answer = String(cRow.answer);
      }
      this.formItem = cRow;
    },

    openUploadModal() {
      this.showUploadModal = true;
      this.formItem = {
        type: "",
        article: "",
        options: [],
        answer: [],
        subjectId: "",
      };
    },

    openDeleteModal(row, questionNo) {
      this.formItem = row;
      this.questionNo = questionNo;
      this.showDeleteModal = true;
    },

    onChange(val) {
      this.formItem.answer = val === "multiple" ? [] : undefined;

      if (val === "trueOrFalse") {
        this.formItem.options = ["true", "false"];
      }
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.formItem.options.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    handleClose(event, name) {
      const index = this.formItem.options.indexOf(name);
      this.formItem.options.splice(index, 1);
    },

    async querySubjects() {
      const { list } = await this.getSubjects();
      this.subjects = list;
      list.forEach((item) => {
        this.subjectObject[item._id] = item.subjectName;
      });
    },

    async query() {
      const { list } = await this.getQuestions(this.formInline);
      this.questions = list;
    },

    async handleOnOk() {
      this.loading = true;
      let res;
      if (this.modalType === "create") {
        res = await this.createQuestion(this.formItem);
      } else {
        this.formItem.questionId = this.formItem._id;
        res = await this.updateQuestion(this.formItem);
      }

      if (res && res.success) {
        await this.query();
        this.$Message.success(`${this.modalType} success`);
      } else {
        this.$Message.error(`${this.modalType} fail`);
      }
      this.loading = false;
    },

    handleUpload(file) {
      this.file = file;
      return false;
    },

    async upload() {
      if (!this.formItem.subjectId || !this.file) {
        this.$Message.error("please select subject type");
        return;
      }

      this.loading = true;
      let formData = new FormData();

      formData.append("excel", this.file);
      formData.append("subjectId", this.formItem.subjectId);

      const { success } = await this.uploadExcel(formData);
      if (success) {
        await this.query();
        this.$Message.success("upload success");
      } else {
        this.$Message.error("upload fail");
      }
      this.loading = false;
      this.showUploadModal = false;
      this.file = null;
    },

    async remove() {
      this.loading = true;
      const { success } = await this.removeQuestion({
        questionId: this.formItem._id,
      });
      if (success) {
        await this.query();
        this.$Message.success("remove success");
      } else {
        this.$Message.error("remove fail");
      }
      this.loading = false;
      this.showDeleteModal = false;
    },
  },

  async mounted() {
    await this.querySubjects();
    await this.query();
  },
};
</script>
<style lang="less" scoped>
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>