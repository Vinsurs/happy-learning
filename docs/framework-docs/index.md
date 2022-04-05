# 框架文档

这部分主要是一些框架文档的自我翻译版本

<VButton text="开始阅读" @click="nextStep" :className="$style['mt-50']" />
<style module>
    .mt-50 {
        margin-top: 50px;
    }
</style>
<script setup>
    import VButton from "../components/VButton.vue"
    import { useRouter } from "vitepress"
    const router = useRouter()
    const nextStep = () => {
        router.go("/framework-docs/vitepress/index.html")
    }
</script>