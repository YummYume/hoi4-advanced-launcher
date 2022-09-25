<script lang="ts">
    import Paper, { Title, Content } from '@smui/paper';
    import { onMount } from 'svelte';
    import IconButton from '@smui/icon-button';
    import { _ } from 'svelte-i18n';
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import Checkbox from '@smui/checkbox';

    import type { Playset } from '../../../stores/playsets';

    export let playset: Playset;
    export let isDefault = false;
    export let updatePlayset: (playset: Playset) => Promise<void>;
    export let removePlayset: (playset: Playset) => Promise<void>;

    let titleElevation = 0;
    let mods = [
        {
            name: 'Russia Reworked',
            description: 'The best mod.'
        },
        {
            name: 'Kaiserreich',
            description: 'Peaceful Mongolia.'
        },
        {
            name: '这个mod是什么',
            description: '什么？'
        }
    ];
    let selected = [mods[2]];

    function elevateTitle(): void {
        titleElevation++;
    }

    onMount(() => {
        const interval = setInterval(() => {
            elevateTitle();

            if (titleElevation >= 24) {
                clearInterval(interval);
            }
        }, 1500 / 24);

        return () => clearInterval(interval);
    });
</script>

<div class="main-paper-container">
    <div class="main-paper">
        <Paper transition elevation={titleElevation} color="primary">
            <div class="main-paper__title">
                <Title>{isDefault ? $_(playset.name) : playset.name}</Title>
                {#if !isDefault}
                    <div class="main-paper__title--buttons">
                        <IconButton class="material-icons no-margin" size="button" on:click={() => updatePlayset(playset)}>
                            edit
                        </IconButton>
                        <IconButton class="material-icons no-margin" size="button" on:click={() => removePlayset(playset)}>
                            delete
                        </IconButton>
                    </div>
                {/if}
            </div>
            <Content>{isDefault ? $_(playset.description) : playset.description ?? ''}</Content>
        </Paper>
        <DataTable style="width: 100%; margin-top: 1rem;">
            <Head>
                <Row>
                    <Cell checkbox>
                        <Checkbox />
                    </Cell>
                    <Cell>{$_('playset.title')}</Cell>
                    <Cell>{$_('playset.description')}</Cell>
                </Row>
            </Head>
            <Body>
                {#each mods as mod (mod.name)}
                    <Row>
                        <Cell checkbox>
                            <Checkbox bind:group={selected} value={mod} valueKey={mod.name} />
                        </Cell>
                        <Cell>{mod.name}</Cell>
                        <Cell>{mod.description}</Cell>
                    </Row>
                {/each}
            </Body>
        </DataTable>
    </div>
</div>

<style>
    .main-paper-container {
        display: flex;
        flex-grow: 1;
    }

    .main-paper {
        width: 100%;
        padding: 1rem;
    }

    .main-paper__title {
        display: flex;
    }

    .main-paper__title > .main-paper__title--buttons {
        flex-grow: 1;
        text-align: right;
    }
</style>
