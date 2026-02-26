<script setup lang="ts">
import { Check } from 'lucide-vue-next'

const props = defineProps({
  CheckboxValue: {
    type: Boolean,
    required: true,
  }
})

const emit = defineEmits(['update:CheckboxValue'])

const toggle = () => {
  emit('update:CheckboxValue', !props.CheckboxValue)
}
</script>

<template>
  <button
    @click="toggle"
    :class="['checkbox', { active: CheckboxValue }]"
  >
    <Check v-if="CheckboxValue" class="icon" />
  </button>
</template>

<style scoped>
.checkbox {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: hsl(0, 0%, 13%);
  border-radius: 6px;
  border: 2px solid transparent;

  transition: 
    background-color 0.2s ease,
    box-shadow 0.2s ease;

  cursor: pointer;
}

.checkbox.active {
  background-color: #4B0082;
}

.icon {
  width: 16px;
  height: 16px;
  color: white;
  stroke-width: 3;
}
</style>