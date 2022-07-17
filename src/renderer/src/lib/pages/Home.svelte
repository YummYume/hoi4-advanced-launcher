<script lang="ts">
    import Button, { Label as ButtonLabel } from '@smui/button';
    import Accordion, { Panel, Header, Content as AccordionContent } from '@smui-extra/accordion';
    import IconButton, { Icon } from '@smui/icon-button';
    import { getNotificationsContext } from 'svelte-notifications';

    import { launchParameters } from '../stores/launchParameters';
    import Parameters from '../components/Parameters.svelte';

    const hoi4Path = api.getHoi4ExecutablePath();
    const { addNotification } = getNotificationsContext();

    let strictMode = true;
    let parametersPanelOpened = false;
    let parameterErrorMessage = null;

    function launchHoi4(): void {
        try {
            api.launchHoi4(hoi4Path, $launchParameters.split(' '));
        } catch (e) {
            console.error(e);
            addNotification({
                id: 'launch-error',
                text: 'Something went wrong while launching the game.',
                position: 'top-center',
                removeAfter: 5000,
                type: 'danger'
            });
            // TODO log error to system
        }
    }
</script>

<div class="container">
    <div class="top-row">
        <Button
            variant="outlined"
            on:click={launchHoi4}
            disabled={Boolean((strictMode && parameterErrorMessage) || !hoi4Path)}
        >
            <ButtonLabel>Launch HOI4</ButtonLabel>
        </Button>
    </div>
    <div class="bottom-row">
        <Accordion style="width: 80%;">
            <Panel square variant="outlined" color="primary" extend bind:open={parametersPanelOpened}>
                <Header>
                    Launch Parameters
                    <span slot="description">Change the launch parameters here.</span>
                    <IconButton slot="icon" toggle pressed={parametersPanelOpened}>
                        <Icon class="material-icons" on>unfold_less</Icon>
                        <Icon class="material-icons">unfold_more</Icon>
                    </IconButton>
                </Header>
                <AccordionContent>
                    <Parameters bind:strictMode bind:parameterErrorMessage bind:launchParameters={$launchParameters} />
                </AccordionContent>
            </Panel>
        </Accordion>
    </div>
</div>

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
