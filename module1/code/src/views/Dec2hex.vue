<template>
  <div class="Dec2hex">
    <section class="input">
      <input v-model="dec" /><a class="btn" @click="convert"
        >转换成64进制长浮点数</a
      >
    </section>

    <section>{{ hex }}</section>
  </div>
</template>

<script>
import { dec2hexDouble } from "../utils/dec2hexDouble.js";
// @ is an alias to /src
const SIGNS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-+".split("");
export default {
  name: "shortURL",
  data() {
    return {
      dec: "",
      hex: "",
    };
  },
  created() {
    console.log("created");
  },
  methods: {
    createDB() {},
    convert() {
      SIGNS[1];
      // try {
      if (isNaN(parseFloat(this.dec))) {
        window.alert("数据有误");
      } else {
        this.hex = dec2hexDouble();
      }
      // } catch (err) {
      // this.hex = "";
      // throw new Error("asdsd");
      // }
    },
  },
};
</script>

<style lang="less" scoped>
.Dec2hex {
  width: 100%;

  .input {
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;

    input {
      width: 400px;
      height: 60px;
      font-size: 24px;
      text-indent: 10px;
    }
  }
}
</style>
