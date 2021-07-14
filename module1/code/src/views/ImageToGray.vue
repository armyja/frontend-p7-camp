<template>
  <div class="page">
    Clipboard
    <hr />
    <section>
      粘贴图片:
      <img ref="img" :src="pasteImage" />
    </section>
    <section>
      灰度图片:
      <canvas ref="grayImage"></canvas>
    </section>
  </div>
</template>

<script>
import { imageToGray } from "@/utils/imageToGray.js"
// @ is an alias to /src

export default {
  name: "Keyborad",
  data() {
    return {
      pasteImage: "",
    };
  },
  mounted() {
    this.toFixed(1.005, 2);

    document.body.oncopy = (evt) => {
      const selection = document.getSelection();
      evt.clipboardData.setData(
        "text/plain",
        "该文档不允许复制剪贴操作，谢谢配合!" + selection.toString()
      );
      evt.preventDefault();
    };

    document.body.onpaste = (evt) => {
      if (evt.clipboardData.items) {
        evt.clipboardData.items.forEach((item) => {
          if (item.type.includes("image")) {
            let file = item.getAsFile();
            console.log(file);

            var reader = new FileReader();
            reader.onload = (e) => {
              // event.target.result就是图片的Base64地址啦
              this.$refs.img.style.width = file.width + "px";
              this.$refs.img.style.height = file.height + "px";
              this.pasteImage = e.target.result;
              // console.log(this.pasteImage);
              this.genGreyImage(this.$refs.grayImage, this.pasteImage);
            };
            reader.onerror = (err) => {
              console.log(err);
            };
            reader.readAsDataURL(file);
          }
        });
      }
    };
  },

  methods: {
    toFixed(num, s) {
      var times = Math.pow(10, s);
      var des = num * times + 0.5;
      des = parseInt(des, 10) / times;
      return des + "";
    },
    genGreyImage(canvas, url) {
      let imgToGray = new imageToGray(canvas, url);
      imgToGray.render();
    },
  },
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  section {
    margin: 20px;
  }
  img {
    border: 1px solid #ccc;
  }
}
</style>
