<template>
  <div class="login">
    <div class="login-con">
      <Card
        icon="log-in"
        title="Online Examination System - Register"
        :bordered="false"
        :shadow="false"
        :dis-hover="true"
      >
        <Form
          ref="formCustom"
          :model="formCustom"
          :rules="ruleCustom"
          :label-width="160"
          class="card-form"
        >
          <FormItem prop="userType" label="User Type">
            <Select
              v-model="formCustom.userType"
              placeholder="please select user type"
            >
              <Option value="teacher">teacher</Option>
              <Option value="student">student</Option>
            </Select>
          </FormItem>
          <FormItem prop="firstName" label="First Name">
            <Input v-model="formCustom.firstName" placeholder="first name">
            </Input>
          </FormItem>
          <FormItem prop="lastName" label="Last Name">
            <Input v-model="formCustom.lastName" placeholder="last name">
            </Input>
          </FormItem>
          <FormItem prop="email" label="Email">
            <Input v-model="formCustom.email" placeholder="email"> </Input>
          </FormItem>
          <FormItem label="Password" prop="password">
            <Input type="password" v-model="formCustom.password"></Input>
          </FormItem>
          <FormItem label="Password Confirm" prop="passwdCheck">
            <Input type="password" v-model="formCustom.passwdCheck"></Input>
          </FormItem>

          <FormItem>
            <Button type="primary" @click="handleSubmit('formCustom')"
              >Register</Button
            >
            <Button @click="handleReset('formCustom')" style="margin-left: 8px"
              >Reset</Button
            >
          </FormItem>
        </Form>
      </Card>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Register",
  data() {
    return {
      formCustom: {
        password: "",
        passwdCheck: "",
        userType: "student",
        firstName: "",
        lastName: "",
        email: ""
      },
      ruleCustom: {
        password: [
          { required: true, message: "password is required", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("Please enter your password"));
              } else {
                if (this.formCustom.passwdCheck !== "") {
                  this.$refs.formCustom.validateField("passwdCheck");
                }
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        passwdCheck: [
          { required: true, message: "password is required", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("Please enter your password again"));
              } else if (value !== this.formCustom.password) {
                callback(new Error("The two input passwords do not match!"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        firstName: [
          { required: true, message: "first name is required", trigger: "blur" }
        ],
        lastName: [
          { required: true, message: "last name is required", trigger: "blur" }
        ],
        email: [
          { required: true, message: "email is required", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
              if (!reg.test(value)) {
                callback(new Error("not valid email!"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      }
    };
  },

  methods: {
    ...mapActions(["handleRegister"]),
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          const { success, message } = await this.handleRegister(
            this.formCustom
          );

          if (success) {
            this.$Message.success({
              content: "register success",
              onClose: () => {
                this.$router.push({ name: "home" });
              }
            });
          } else {
            this.$Message.error(message);
          }
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>
<style scoped>
.card-form {
  width: 600px;
}
</style>
