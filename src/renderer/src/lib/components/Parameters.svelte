<script lang="ts">
    import Chip, { Set, Text as ChipText } from '@smui/chips';
    import Textfield from '@smui/textfield';
    import Tooltip, { Wrapper, Content as TooltipContent } from '@smui/tooltip';
    import Switch from '@smui/switch';
    import FormField from '@smui/form-field';
    import HelperText from '@smui/textfield/helper-text';
    import { dialogs } from 'svelte-dialogs';
    import { getNotificationsContext } from 'svelte-notifications';

    import { Parameter, parameters } from '../data/parameters';
    import ParameterArgumentDialog from './ParameterArgumentDialog.svelte';

    export let strictMode = true;
    export let parameterErrorMessage = null;
    export let launchParameters = '';

    const { addNotification } = getNotificationsContext();

    $: launchParameters = launchParameters.trim();
    $: inputParameters = launchParameters.split(' ');
    $: selected = parameters.filter((value) => inputParameters.some((v) => value.matches(v)));
    $: {
        parameterErrorMessage = null;

        if (Boolean('' !== launchParameters && inputParameters)) {
            inputParameters.every((input) => {
                if (!parameters.some((parameter) => parameter.matches(input))) {
                    parameterErrorMessage = `Invalid parameter : ${input}`;

                    return false;
                }

                return true;
            });
        }
    }

    async function handleChipSelection(e: CustomEvent): Promise<void> {
        const chipDetails = e.detail;
        const parameter: Parameter = chipDetails.chipId;

        let currentParameters = inputParameters;

        if (chipDetails.selected) {
            if (!currentParameters.some((value) => parameter.matches(value))) {
                currentParameters = [...currentParameters, parameter.key];
            }

            if (parameter.argument) {
                let argument = null;

                try {
                    argument = await dialogs.modal(ParameterArgumentDialog, { strictMode, parameter });
                } catch (e) {
                    console.error(e);
                    addNotification({
                        id: 'launch-error',
                        text: 'Oops... Something went wrong.',
                        position: 'top-center',
                        removeAfter: 5000,
                        type: 'danger'
                    });
                    // TODO log error to system
                } finally {
                    if (argument && 0 < currentParameters.length) {
                        const lastElement = currentParameters[currentParameters.length - 1];

                        currentParameters.splice(-1, 1, `${lastElement}=${argument}`);
                    } else {
                        // always trigger a re-render
                        currentParameters.splice(-1, 1, argument);
                    }
                }
            }
        } else {
            currentParameters = currentParameters.filter((value) => !parameter.matches(value));
        }

        launchParameters = currentParameters.join(' ');
    }
</script>

<Textfield
    label="Parameters"
    bind:value={launchParameters}
    type="text"
    style="width: 100%;"
    helperLine$style="width: 100%;"
    invalid={Boolean(strictMode && parameterErrorMessage)}
>
    <HelperText slot="helper" style="color: #b00020;">
        {#if strictMode}
            {parameterErrorMessage ?? ''}
        {/if}
    </HelperText>
</Textfield>
<FormField>
    <Switch bind:checked={strictMode} />
    <span slot="label">Enable strict mode</span>
</FormField>
<Set chips={parameters} let:chip key={(chip) => chip.key} {selected} filter on:SMUIChip:selection={handleChipSelection}>
    <Wrapper rich>
        <Chip {chip} touch shouldFocusPrimaryActionOnClick={false} shouldRemoveOnTrailingIconClick={false}>
            <ChipText>{chip.key}</ChipText>
        </Chip>
        <Tooltip showDelay={1000} hideDelay={100}>
            <TooltipContent>{chip.description ?? 'No description provided.'}</TooltipContent>
        </Tooltip>
    </Wrapper>
</Set>
