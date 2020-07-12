<template>
  <div>
    <div class="add-btn">
      <Button type="primary" icon="ios-add" @click="openCreateModal"
        >Create Subject</Button
      >
    </div>
    <Table border :columns="columns" :data="subjects">
      <template slot-scope="{ row, index }" slot="no">
        <span>{{ index + 1 }}</span>
      </template>
      <template slot-scope="{ row }" slot="action">
        <Button
          type="primary"
          ghost
          size="small"
          style="margin-right: 5px"
          @click="openUpdateModal(row)"
          >edit</Button
        >
        <Button type="error" size="small" ghost @click="openDeleteModal(row)"
          >delete</Button
        >
      </template>
    </Table>

    <Modal
      v-model="showCreateOrUpdateModal"
      :title="`subject - ${modalType}`"
      :loading="loading"
      @on-ok="handleOnOk"
    >
      <Form :model="formItem" :label-width="100">
        <FormItem label="subject name">
          <Input v-model="formItem.subjectName"></Input>
        </FormItem>
        <FormItem label="subject code">
          <Input v-model="formItem.subjectCode"></Input>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="showDeleteModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>subject - delete</span>
      </p>
      <div style="text-align:center">
        <p>Will you delete subject: {{ formItem.subjectName }}?</p>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="error" :loading="loading" @click="remove">delete</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "subjects",
  components: {},
  data() {
    return {
      modalType: "create", // create | update
      showCreateOrUpdateModal: false,
      showDeleteModal: false,
      loading: false,
      formItem: {
        _id: "",
        subjectName: "",
        subjectCode: ""
      },
      columns: [
        {
          title: "No",
          slot: "no",
          width: 70
        },
        {
          title: "Subject Name",
          key: "subjectName"
        },
        {
          title: "Subject Code",
          key: "subjectCode"
        },
        {
          title: "Action",
          slot: "action",
          width: 150,
          align: "center"
        }
      ],
      subjects: []
    };
  },
  methods: {
    ...mapActions([
      "getSubjects",
      "createSubject",
      "updateSubject",
      "removeSubject"
    ]),
    openCreateModal() {
      this.modalType = "create";
      this.showCreateOrUpdateModal = true;
      this.formItem = {
        _id: "",
        subjectName: "",
        subjectCode: ""
      };
    },

    openUpdateModal(row) {
      this.modalType = "update";
      this.showCreateOrUpdateModal = true;
      const { _id, subjectCode, subjectName } = row;
      this.formItem = { _id, subjectCode, subjectName };
    },

    openDeleteModal(row) {
      const { _id, subjectCode, subjectName } = row;
      this.formItem = { _id, subjectCode, subjectName };
      this.showDeleteModal = true;
    },

    async query() {
      const { list } = await this.getSubjects();
      this.subjects = list;
    },

    async handleOnOk() {
      this.loading = true;
      const { _id, subjectCode, subjectName } = this.formItem;

      let res;
      if (this.modalType === "create") {
        res = await this.createSubject({
          subjectCode,
          subjectName
        });
      } else {
        res = await this.updateSubject({
          subjectId: _id,
          subjectCode,
          subjectName
        });
      }

      if (res && res.success) {
        await this.query();
        this.$Message.success(`${this.modalType} success`);
      } else {
        this.$Message.error(`${this.modalType} fail`);
      }
      this.loading = false;
    },

    async remove() {
      this.loading = true;
      const { success } = await this.removeSubject({
        subjectId: this.formItem._id
      });
      if (success) {
        await this.query();
        this.$Message.success("remove success");
      } else {
        this.$Message.error("remove fail");
      }
      this.loading = false;
      this.showDeleteModal = false;
    }
  },

  async mounted() {
    await this.query();
  }
};
</script>

<style lang="less">
.add-btn {
  margin-bottom: 1rem;
}
</style>
