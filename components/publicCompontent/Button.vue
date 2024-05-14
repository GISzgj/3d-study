<template>
  <button
    class="text"
    :style="`width: ${props.size.width};height: ${props.size.height};padding: ${props.size.padding};`"
    @click.prevent="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup>
  const props = defineProps({
    size: {
      type: Object,
      default: {
        width: '55px',
        height: '35px',
        padding: '2px'
      }
    }
  })
  const emit = defineEmits(['click'])
  const handleClick = e => {
    emit('click', e)
    createWave(e)
  }
  function createWave(event) {
    const button = event.currentTarget
    const wave = document.createElement('span')
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    wave.classList.add('wave')
    wave.style.display = 'inline-block'
    wave.style.width = `${size}px`
    wave.style.height = `${size}px`
    wave.style.left = `${event.clientX - rect.left - size / 2}px`
    wave.style.top = `${event.clientY - rect.top - size / 2}px`
    button.appendChild(wave)
    setTimeout(() => {
      wave.remove()
    }, 500)
  }
</script>
<style>
  .wave {
    position: absolute;
    border-radius: 50%;
    /* background-color: rgba(255, 255, 255, 0.4); */
    background-color: rgba(8, 211, 255, 0.5);
    transform: scale(0);
    animation: ripple 0.5s linear;
    z-index: 999;
  }
  @keyframes ripple {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
</style>
<style scoped>
  button {
    background-color: rgba(136, 236, 240, 0.28);
    /* background-color: transparent; */
    border: 1px solid rgba(136, 236, 240, 0.28);
    text-decoration: none;
    text-align: center;
    background-clip: content-box; /* 仅填充内容区域 */
    box-sizing: border-box;
    cursor: pointer;
    transition: background-color 0.1s, transform 0.1s, box-shadow 0.1s;
  }
  button:active {
    background-color: rgba(136, 236, 240, 0.5);
    /* background-color: rgba(45, 12, 19, 0.5); */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
  .text {
    display: inline-block;
    color: #ccf;
  }
</style>
