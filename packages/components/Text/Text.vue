<template>
  <component
    :is="tag"
    :class="textKls"
    :style="{ '-webkit-line-clamp': lineClamp }"
  >
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { type TextProps } from "./types";
import { useNamespace } from "@Wannaer-element/hooks";
import { isUndefined } from "lodash-es";
import "./style";

defineOptions({
  name: "WanText",
});

const props = withDefaults(defineProps<TextProps>(), {
  tag: "span",
  type: "primary",
});

const ns = useNamespace("text");

const textKls = computed(() => [
  ns.b(),
  ns.m(props.type),
  ns.is("truncated", props.truncated),
  ns.is("line-clamp", !isUndefined(props.lineClamp)),
]);
</script>

<style scoped></style>
