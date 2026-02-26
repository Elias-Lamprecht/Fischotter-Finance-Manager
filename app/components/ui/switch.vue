<script setup lang="ts">
const props = defineProps({
    SwitchValue: {
        type: Boolean,
        required: true,
    }
})

const emit = defineEmits(['update:SwitchValue'])

const toggle = () => {
    emit('update:SwitchValue', !props.SwitchValue)
}
</script>
<template>
    <button
  @click="toggle"
  :class="['switch', { active: SwitchValue }]"
>
  <div class="thumb"></div>
</button>
</template>
<style scoped>
.switch {
  width: 48px;              
  height: 24px;             
  display: flex;            
  align-items: center;      
  padding: 4px;             
  border-radius: 9999px;    
  background-color: hsl(0, 0%, 13%); 
  transition: background-color 0.3s ease;
  cursor: pointer;
  border: none;
}

.switch.active {
  background-color: #4B0082;
}

.thumb {
  width: 16px;              
  height: 16px;             
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2); 
  transform: translateX(0); 
  transition: transform 0.3s ease;
}

.switch.active .thumb {
  transform: translateX(24px);
}</style>