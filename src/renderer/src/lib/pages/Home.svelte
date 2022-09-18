<script lang="ts">
    import Button, { Label as ButtonLabel } from '@smui/button';
    import Accordion, { Panel, Header, Content as AccordionContent } from '@smui-extra/accordion';
    import IconButton, { Icon } from '@smui/icon-button';
    import { toast } from '@zerodevx/svelte-toast';
    import { fade } from 'svelte/transition';
    import { _ } from 'svelte-i18n';

    import { launchParameters, launchParametersStrictMode } from '../stores/launchParameters';
    import { launchParametersOpened } from '../stores/launchParametersOpened';
    import Parameters from '../components/pages/home/Parameters.svelte';

    let parameterErrorMessage = null;

    function launchHoi4(): void {
        if (!api.isValidHoi4ExecutablePath(api.getHoi4ExecutablePath())) {
            toast.push($_('notification.invalid_hoi4_executable_path'), { classes: ['error'] });

            return;
        }

        try {
            api.launchHoi4($launchParameters.split(' '));
        } catch (e) {
            api.logs().error(e);

            toast.push($_('notification.launch_error'), { classes: ['error'] });
        }
    }
</script>

<section in:fade class="container">
    <div class="top-row">
        <Button
            variant="outlined"
            on:click={launchHoi4}
            disabled={Boolean($launchParametersStrictMode && parameterErrorMessage)}
        >
            <ButtonLabel>{$_('home.launch_hoi4')}</ButtonLabel>
        </Button>
    </div>
    <div class="bottom-row">
        <Accordion style="width: 80%;">
            <Panel square variant="outlined" color="primary" extend bind:open={$launchParametersOpened}>
                <Header>
                    {$_('home.launch_parameters')}
                    <span slot="description">{$_('home.launch_parameters.description')}</span>
                    <IconButton slot="icon" toggle pressed={$launchParametersOpened}>
                        <Icon class="material-icons" on>unfold_less</Icon>
                        <Icon class="material-icons">unfold_more</Icon>
                    </IconButton>
                </Header>
                <AccordionContent>
                    <Parameters
                        bind:strictMode={$launchParametersStrictMode}
                        bind:launchParameters={$launchParameters}
                        bind:parameterErrorMessage
                    />
                </AccordionContent>
            </Panel>
        </Accordion>
    </div>
</section>

<style>
    .container {
        display: flex;
        flex: 1;
        flex-direction: column;
        margin: 0 10px;
    }

    .top-row {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: end;
        flex: 1;
        padding: 10px;
    }

    .bottom-row {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
        flex: 1;
        padding: 10px;
    }
</style>
