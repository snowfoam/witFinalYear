<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="Online Examination System" :bordered="false">
        <div class="form-con">
          <Form
            ref="loginForm"
            :label-width="100"
            :model="form"
            :rules="rules"
            @keydown.enter.native="login"
          >
            <FormItem prop="userType" label="user type">
              <Select
                v-model="form.userType"
                placeholder="please select user type"
              >
                <Option value="teacher">teacher</Option>
                <Option value="student">student</Option>
              </Select>
            </FormItem>
            <FormItem prop="email" label="email">
              <Input v-model="form.email" placeholder="email"> </Input>
            </FormItem>
            <FormItem prop="password" label="password">
              <Input
                type="password"
                v-model="form.password"
                placeholder="password"
              >
              </Input>
            </FormItem>
            <FormItem class="form-btn">
              <Button
                @click="$router.push('/register')"
                class="mr-20"
                type="primary"
                ghost
                >register</Button
              >
              <Button @click="login" type="primary">login</Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Login",
  computed: {
    rules() {
      return {
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
        ],
        password: [
          { required: true, message: "password is required", trigger: "blur" }
        ]
      };
    }
  },

  data() {
    return {
      form: {
        userType: "student",
        email: "",
        password: ""
      }
    };
  },
  methods: {
    ...mapActions(["handleLogin"]),
    login() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          const { success, message } = await this.handleLogin(this.form);
          if (success) {
            this.$Message.success("login success");
            this.$router.push({ name: "home" });
          } else {
            this.$Message.error(message);
          }
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../styles/login.less";
.form-btn {
  margin-top: 2.5rem;
}
.mr-20 {
  margin-right: 1rem;
}
</style>
