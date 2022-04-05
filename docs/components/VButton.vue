<template>
    <button :class="[$style.btn, className]" @click="handleClick">
        {{text}}
    </button>
</template>
<style module>
.btn {
    font-size: 1rem;
    border: none;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background-color: rgb(65, 184, 131);
    cursor: pointer;
    padding: 0.3rem 0.65rem;
}
.btn:hover {
    opacity: 0.8;
}
</style>
<script setup>
    const props = defineProps({
        text: {
            type: String,
            required: true
        },
        className: String
    });
    const emit = defineEmits(["click"])
    const handleClick = () => {
        emit("click")
    }
</script>