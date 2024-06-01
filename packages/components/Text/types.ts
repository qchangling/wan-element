import type { Component } from "vue";

export type TextType = "primary" | "success" | "warning" | "danger" | "info";
export type TextSize = "default" | "large" | "small";
export interface TextProps {
  tag?: string | Component;
  type?: TextType;
  size?: TextSize;
  truncated?: boolean;
  lineClamp?: String | Number;
}
