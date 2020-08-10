<template>
  <div>
    <ul v-if="!processing || (processing && notStart)">
      <li>student name: {{ userName }}</li>
      <li>course name: {{ exam.courseName }}</li>
      <li>begin time: {{ dateFormat(exam.beginTime) }}</li>
      <li>end time: {{ dateFormat(exam.endTime) }}</li>
      <li>duration: {{ exam.duration }}</li>
      <li v-if="exam.status === 'cancled'">Exam Cancled</li>
      <li v-else-if="exam.status === 'nostart'">
        Exam not start
      </li>
      <li v-else-if="exam.status === 'ended'">
        Exam ended, your score: {{ exam.score }}
      </li>
      <li v-else>Exam will start {{ timeFormat(startTiming) }}</li>
    </ul>

    <div v-else>
      <div>Exam will end {{ timeFormat(endTiming) }}</div>
      <div><Button type="primary" @click="submit">Submit</Button></div>
      <div
        v-for="(question, index) in exam.questions"
        :key="index"
        class="question"
      >
        <div class="index">{{ index + 1 }}.</div>
        <div class="article">
          <div class="desc">{{ question.article }}</div>
          <div v-if="question.type === 'multiple'">
            <CheckboxGroup v-model="question.answer">
              <Checkbox
                :label="option + ''"
                v-for="(option, i) in question.options"
                :key="`${index}-${i}`"
              ></Checkbox>
            </CheckboxGroup>
          </div>
          <div v-else>
            <RadioGroup v-model="question.answer">
              <Radio
                :label="option + ''"
                v-for="(option, i) in question.options"
                :key="`${index}-${i}`"
              ></Radio>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import dayjs from "dayjs";

export default {
  name: "exam",
  computed: {
    exam() {
      return this.$store.state.app.exam || {};
    },
    processing() {
      return this.exam.status === "processing";
    },
    userName() {
      return this.$store.getters.userName;
    },
  },
  data() {
    return {
      notStart: false,
      notEnd: false,
      timer: null,
      startTiming: 0,
      endTiming: 0,
    };
  },
  methods: {
    ...mapActions(["getExamById", "examSubmit"]),

    dateFormat(date) {
      return date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "";
    },
    timeFormat(time) {
      return (
        Math.floor(time / 60)
          .toString()
          .padStart(2, "0") +
        ":" +
        (time % 60).toString().padStart(2, "0")
      );
    },
    async submit() {
      const examId = this.exam._id;
      const answers = this.exam.questions.map((item) => {
        return { _id: item._id, answer: item.answer };
      });
      const {
        data: { score, errorList },
        success,
      } = await this.examSubmit({ examId, answers });
      if (success) {
        this.$Message.success({
          content: `success to submit, your score is: ${score}`,
          onClose() {
            window.location.reload();
          },
        });
      } else {
        this.$Message.error(`submit fail`);
      }
    },

    countDown() {
      this.endTiming = dayjs(this.exam.endTime).diff(dayjs(), "second");
      this.timer = setInterval(() => {
        this.endTiming--;
        if (this.endTiming <= 0) {
          clearInterval(this.timer);
          this.timer = null;
          this.notEnd = false;
          this.submit();
        }
      }, 1000);
    },
  },
  
  async mounted() {
    const examId = this.$route.params.examId;
    await this.getExamById({ examId });

    this.notStart =
      this.processing && dayjs().isBefore(dayjs(this.exam.beginTime));
    this.notEnd = this.processing && dayjs().isBefore(dayjs(this.exam.endTime));

    if (this.notStart) {
      this.startTiming = dayjs(this.exam.beginTime).diff(dayjs(), "second");
      this.timer = setInterval(() => {
        this.startTiming--;
        if (this.startTiming <= 0) {
          clearInterval(this.timer);
          this.timer = null;
          this.notStart = false;
          this.notEnd = true;
          this.countDown();
        }
      }, 1000);
    }

    if (this.notEnd) {
      this.countDown();
    }
  },
};
</script>

<style lang="less" scoped>
.question {
  display: flex;
  margin: 1rem 0 0 0;
}
.index {
  width: 20px;
}
</style>
