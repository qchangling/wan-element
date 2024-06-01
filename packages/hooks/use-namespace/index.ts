// 这段代码是一个Vue.js的组件库的一部分，它提供了一个`useNamespace`函数，用于生成符合BEM（Block Element Modifier）命名规范的类名，以及一些与CSS变量相关的工具函数。
// 这段代码提供了一套工具，用于在Vue组件中生成符合BEM命名规范的类名和CSS变量。
// 它允许开发者通过组合block、element、modifier和state来创建可维护和可扩展的CSS类名。
// 同时，它还提供了CSS变量相关的工具函数，使得在Vue组件中使用CSS变量变得更加方便。

import { computed, getCurrentInstance, inject, ref, unref } from "vue";
// 从Vue导入了computed、getCurrentInstance、inject、ref和unref等函数和钩子

import type { InjectionKey, Ref } from "vue";
// 导入InjectionKey和Ref类型，用于类型注解

export const defaultNamespace = "wan";
// 导出一个默认命名空间字符串'Wan'

const statePrefix = "is-";
// 定义一个状态前缀字符串'is-'，用于生成状态类名

const _bem = (
  namespace: string,
  block: string,
  blockSuffix: string,
  element: string,
  modifier: string
) => {
  // 定义一个私有函数_bem，用于生成BEM类名
  let cls = `${namespace}-${block}`;
  if (blockSuffix) {
    cls += `-${blockSuffix}`;
  }
  if (element) {
    cls += `__${element}`;
  }
  if (modifier) {
    cls += `--${modifier}`;
  }
  return cls;
};

export const namespaceContextKey: InjectionKey<Ref<string | undefined>> =
  Symbol("namespaceContextKey");
// 导出一个InjectionKey，用于注入/解析命名空间

export const useGetDerivedNamespace = (
  namespaceOverrides?: Ref<string | undefined>
) => {
  // 导出一个函数useGetDerivedNamespace，用于获取派生的命名空间
  const derivedNamespace =
    namespaceOverrides ||
    (getCurrentInstance()
      ? inject(namespaceContextKey, ref(defaultNamespace))
      : ref(defaultNamespace));
  // 使用getCurrentInstance检查是否在组件中，并尝试注入命名空间，否则使用默认
  const namespace = computed(() => {
    return unref(derivedNamespace) || defaultNamespace;
  });
  // 创建一个计算属性，返回解析或默认的命名空间
  return namespace;
};

export const useNamespace = (
  block: string,
  namespaceOverrides?: Ref<string | undefined>
) => {
  // 导出一个函数useNamespace，用于创建BEM相关的函数
  const namespace = useGetDerivedNamespace(namespaceOverrides);
  // 使用useGetDerivedNamespace获取命名空间
  // 下面定义了一系列函数，用于生成BEM的block、element、modifier的类名
  const b = (blockSuffix = "") =>
    _bem(namespace.value, block, blockSuffix, "", "");
  const e = (element?: string) =>
    element ? _bem(namespace.value, block, "", element, "") : "";
  const m = (modifier?: string) =>
    modifier ? _bem(namespace.value, block, "", "", modifier) : "";
  const be = (blockSuffix?: string, element?: string) =>
    blockSuffix && element
      ? _bem(namespace.value, block, blockSuffix, element, "")
      : "";
  const em = (element?: string, modifier?: string) =>
    element && modifier
      ? _bem(namespace.value, block, "", element, modifier)
      : "";
  const bm = (blockSuffix?: string, modifier?: string) =>
    blockSuffix && modifier
      ? _bem(namespace.value, block, blockSuffix, "", modifier)
      : "";
  const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
    blockSuffix && element && modifier
      ? _bem(namespace.value, block, blockSuffix, element, modifier)
      : "";
  // is函数用于生成状态类名
  const is: {
    (name: string, state: boolean | undefined): string;
    (name: string): string;
  } = (name: string, ...args: [boolean | undefined] | []) => {
    const state = args.length >= 1 ? args[0]! : true;
    return name && state ? `${statePrefix}${name}` : "";
  };
  // 下面是与CSS变量相关的函数
  const cssVar = (object: Record<string, string>) => {
    // 为给定的对象生成CSS变量样式
    const styles: Record<string, string> = {};
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${key}`] = object[key];
      }
    }
    return styles;
  };
  const cssVarBlock = (object: Record<string, string>) => {
    // 为给定的对象生成带block名称的CSS变量样式
    const styles: Record<string, string> = {};
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${block}-${key}`] = object[key];
      }
    }
    return styles;
  };
  const cssVarName = (name: string) => `--${namespace.value}-${name}`;
  const cssVarBlockName = (name: string) =>
    `--${namespace.value}-${block}-${name}`;
  // 返回一个对象，包含所有定义的函数和命名空间
  return {
    namespace,
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
    cssVar,
    cssVarName,
    cssVarBlock,
    cssVarBlockName,
  };
};

export type UseNamespaceReturn = ReturnType<typeof useNamespace>;
// 导出UseNamespaceReturn类型，它是useNamespace函数返回值的类型
