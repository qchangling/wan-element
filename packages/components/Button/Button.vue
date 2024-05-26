<script setup lang="ts">
import { computed, ref } from "vue";
import type { ButtonEmits, ButtonInstance, ButtonProps } from "./types";
import { throttle } from "lodash-es";
import WanIcon from "../Icon/Icon.vue";
defineOptions({
  name: "WanButton",
});
const props = withDefaults(defineProps<ButtonProps>(), {
  tag: "button",
  nativeType: "button",
  useThrottle: true,
  throttleDuration: 500,
});

const emits = defineEmits<ButtonEmits>();
const slots = defineSlots();

const _ref = ref<HTMLButtonElement>();
const size = computed(() =>  props.size ?? "");
const type = computed(() => props.type ?? "");
const disabled = computed(
  () => props.disabled || false
);
const iconStyle = computed(() => ({
  marginRight: slots.default ? "6px" : "0px",
}));

const handleBtnClick = (e: MouseEvent) => {
  emits("click", e);
};
const handlBtneCLickThrottle = throttle(handleBtnClick, props.throttleDuration);

defineExpose<ButtonInstance>({
  ref: _ref,
  disabled,
  size,
  type,
});
</script>

<template>
  <component
    :is="props.tag"
    ref="_ref"
    class="wan-button"
    :class="{
      [`wan-button--${type}`]: type,
      [`wan-button--${size}`]: size,
      'is-plain': plain,
      'is-loading': loading,
      'is-disabled': disabled,
      'is-round': round,
      'is-circle': circle,
    }"
    :type="tag === 'button' ? nativeType : void 0"
    :disabled="disabled || loading ? true : void 0"
    @click="
      (e: MouseEvent) =>
        useThrottle ? handlBtneCLickThrottle(e) : handleBtnClick(e)
    "
  >
    <template v-if="loading">
      <slot name="loading">
        <wan-icon
          class="loading-icon"
          :icon="loadingIcon ?? 'spinner'"
          :style="iconStyle"
          size="1x"
          spin
        />
      </slot>
    </template>
    <wan-icon
      :icon="icon"
      size="1x"
      :style="iconStyle"
      v-if="icon && !loading"
    />
    <slot></slot>
  </component>
</template>

<style scoped>
@import "./style.css";
</style>
