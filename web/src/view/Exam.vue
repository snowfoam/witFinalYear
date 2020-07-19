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
                :label="option"
                v-for="(option, i) in question.options"
                :key="`${index}-${i}`"
              ></Checkbox>
            </CheckboxGroup>
          </div>
          <div v-else>
            <RadioGroup v-model="question.answer">
              <Radio
                :label="option"
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
      // var a = {
      //   success: true,
      //   data: {
      //     duration: 60,
      //     _id: "5f098089ce60583ec862e028",
      //     studentId: "5efca229d4a74338883070fa",
      //     courseId: "5ee62a83f35c4631a42b103a",
      //     createTime: "2020-07-11T09:04:09.153Z",
      //     beginTime: "2020-07-11T11:19:27.054Z",
      //     endTime: "2020-07-11T12:45:27.054Z",
      //     score: null,
      //     status: "processing",
      //     questions: [
      //       {
      //         _id: "5eeec66904e2d90d20327508",
      //         type: "single",
      //         article: "single select test",
      //         options: [1, 2, 3],
      //         answer: null,
      //         subjectId: "5ee621fcf48e72246cc73228",
      //         __v: 1
      //       },
      //       {
      //         _id: "5f01ade079e46a3de4f26b9b",
      //         type: "single",
      //         article: "en",
      //         options: [3, 5, 6, 7],
      //         answer: null,
      //         subjectId: "5ee621fcf48e72246cc73228",
      //         __v: 0
      //       },
      //       {
      //         _id: "5f01adc679e46a3de4f26b98",
      //         type: "single",
      //         article: "en",
      //         options: [1, 2, 3],
      //         answer: null,
      //         subjectId: "5ee621fcf48e72246cc73228",
      //         __v: 0
      //       },
      //       {
      //         _id: "5eeee63332cbf50c30990810",
      //         type: "single",
      //         article: "single select test",
      //         options: [1, 2, 3],
      //         answer: null,
      //         subjectId: "5ee621fcf48e72246cc73228",
      //         __v: 0
      //       },
      //       {
      //         _id: "5f01addd79e46a3de4f26b9a",
      //         type: "single",
      //         article: "en",
      //         options: [3, 5, 6, 7],
      //         answer: null,
      //         subjectId: "5ee621fcf48e72246cc73228",
      //         __v: 0
      //       },
      //       {
      //         _id: "5f01adda79e46a3de4f26b99",
      //         type: "single",
      //         article: "en",
      //         options: [3, 5, 6, 7],
      //         answer: null,
      //         subjectId: "5ee621fcf48e72246cc73228",
      //         __v: 0
      //       },
      //       {
      //         _id: "5f01ae0479e46a3de4f26b9d",
      //         type: "single",
      //         article: "en",
      //         options: [8, 9, 10, 11, 12],
      //         answer: null,
      //         subjectId: "5ee621fcf48e72246cc73228",
      //         __v: 0
      //       },
      //       {
      //         _id: "5f01adbd79e46a3de4f26b97",
      //         type: "single",
      //         article: "en",
      //         options: [1, 2, 3],
      //         answer: null,
      //         subjectId: "5ee621fcf48e72246cc73228",
      //         __v: 0
      //       },
      //       {
      //         _id: "5f01ae0b79e46a3de4f26b9f",
      //         type: "single",
      //         article: "en",
      //         options: [8, 9, 10, 11, 12],
      //         answer: null,
      //         subjectId: "5ee621fcf48e72246cc73228",
      //         __v: 0
      //       },
      //       {
      //         _id: "5f01ae0079e46a3de4f26b9c",
      //         type: "single",
      //         article: "en",
      //         options: [8, 9, 10, 11, 12],
      //         answer: null,
      //         subjectId: "5ee621fcf48e72246cc73228",
      //         __v: 0
      //       }
      //     ],
      //     __v: 0
      //   },
      //   message: ""
      // };
      // return a.data;
      return this.$store.state.app.exam || {};
    },
    processing() {
      return this.exam.status === "processing";
    },
    notStart() {
      return this.processing && dayjs().isBefore(dayjs(this.exam.beginTime));
    },
    notEnd() {
      return this.processing && dayjs().isBefore(dayjs(this.exam.endTime));
    },
    userName() {
      return this.$store.getters.userName;
    }
  },
  data() {
    return {
      timer: null,
      startTiming: 0,
      endTiming: 0
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
      const answers = this.exam.questions.map(item => {
        return { _id: item._id, answer: item.answer };
      });
      const {
        data: { score, errorList },
        success
      } = await this.examSubmit({ examId, answers });
      if (success) {
        this.$Message.success({
          content: `success to submit, your score is: ${score}`,
          onClose() {
            window.location.reload();
          }
        });
      } else {
        this.$Message.error(`submit fail`);
      }
    }
  },
  async mounted() {
    if (!this.exam.courseName) {
      const examId = this.$route.params.examId;
      await this.getExamById({ examId });
      if (this.notStart) {
        this.startTiming = dayjs(this.exam.beginTime).diff(dayjs(), "second");
        this.timer = setInterval(() => {
          this.startTiming--;
          if (this.startTiming <= 0) {
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      } else if (this.notEnd) {
        this.endTiming = dayjs(this.exam.endTime).diff(dayjs(), "second");
        this.timer = setInterval(() => {
          this.endTiming--;
          if (this.endTiming <= 0) {
            clearInterval(this.timer);
            this.timer = null;
            this.submit();
          }
        }, 1000);
      }
    }
  }
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
