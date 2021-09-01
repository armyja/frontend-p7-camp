<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
interface ConversationValue {
  user: string;
  checkmark: string;
  data: string;
  received: boolean;
}
export default defineComponent({
  name: 'HelloWorld',
  props: {
    names: {
      type: Array as PropType<String[]>
    },
    conversation: Array as PropType<ConversationValue[]>,
  },
  setup: () => {
    const { t } = useI18n();

    return { t };
  },
  data() {
    return {
      message: ""
    }
  },
  methods: {
    handleClick() {
      this.$emit("append-message", this.message);
    }
  }
});
</script>
<template>
  <div class="text-center text-md">
    <div v-for="item in conversation" :key="item.checkmark">
      <div>{{ item.user }}</div>
      <div>
        <span>{{ item.data }}</span>
        <span v-if="item.received">[OK]</span>
      </div>
    </div>
    <textarea v-model="message" @keyup.enter="handleClick"></textarea>
    <el-button type="primary" @click="handleClick">发送</el-button>
  </div>
</template>

<style scoped>
a {
  @apply text-cyan-400 hover:text-cyan-500 transition-all ease-out duration-100;
}
</style>

<style scoped>
label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  @apply text-xs font-mono bg-yellow-200 text-yellow-700 rounded px-0.5 py-0.5;
}
</style>
