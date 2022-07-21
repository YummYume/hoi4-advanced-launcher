<script lang="ts">
    import Button, { Label as ButtonLabel } from '@smui/button';
    import { DialogContent, getClose, getOptions } from 'svelte-dialogs';

    const close = getClose();
    const { titleId } = getOptions();

    export let path: string;
</script>

<DialogContent>
    <h1 id={titleId} slot="header">Confirm your path</h1>
    <svelte:fragment slot="body">
        <p>
            The path given looks right. Before confirming, ensure this is the right path to your HOI4 game folder, as an
            invalid path could cause issues.
        </p>
        <div class="path-content">
            <pre>{path}</pre>
        </div>
    </svelte:fragment>
    <svelte:fragment slot="footer">
        <Button on:click={() => close(false)}>
            <ButtonLabel>Cancel</ButtonLabel>
        </Button>
        <Button defaultAction on:click={() => close(true)}>
            <ButtonLabel>Confirm</ButtonLabel>
        </Button>
    </svelte:fragment>
</DialogContent>

<style>
    .path-content {
        overflow-x: auto;
    }

    .path-content::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px rgb(204 204 204 / 80%);
        border-radius: 10px;
    }

    .path-content::-webkit-scrollbar-thumb {
        box-shadow: inset 0 0 5px #cccccc;
        border-radius: 10px;
    }

    .path-content::-webkit-scrollbar {
        width: 5px;
    }
</style>
