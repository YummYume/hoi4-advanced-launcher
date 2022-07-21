<script lang="ts">
    import { draw } from 'svelte/transition';
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="250" viewBox="0 0 100 10">
    <g>
        <path in:draw={{ duration: 333 }} fill="crimson" stroke="crimson" stroke-width="1" d="M0 1 H 33" />
        <path in:draw={{ duration: 666 }} fill="crimson" stroke="crimson" stroke-width="1" d="M0 4 H 66" />
        <path in:draw={{ duration: 1000 }} fill="crimson" stroke="crimson" stroke-width="1" d="M0 7 H 100" />
    </g>
</svg>

<style>
    svg {
        display: block;
    }
</style>
