<template>
  <svg aria-hidden="true" :class="svgClass()">
    <use :xlink:href="symbolId" :fill="props.fill" />
  </svg>
</template>

<!-- SvgIcon组件，可将svg图标直接当组件使用 -->
<script setup>
  import { computed } from 'vue'

  /**
   * 输入属性             类型                默认值              是否必选                描述
   *  name              string             undefined              是                  svg图标名字
   *  fill              string              #ffffff               否                  svg图标填充颜色
   *  className         string                   ''               否                  svg图标样式
   */

  const props = defineProps({
    name: {
      type: String
    },
    className: {
      type: String
    },
    fill: {
      type: String,
      default: '#ffffff'
    }
  })
  function svgClass() {
    if (props.className) {
      return 'svg-icon ' + props.className
    } else {
      return 'svg-icon'
    }
  }
  // 获取svg图标名称，需要和vite.config.ts中的配置保持一致
  const symbolId = computed(() => `#${props.name}`)
</script>

<style scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
