<script lang="ts">
    import Chip, { Set, Text as ChipText } from '@smui/chips';
    import Textfield from '@smui/textfield';
    import Tooltip, { Wrapper, Content as TooltipContent } from '@smui/tooltip';
    import Switch from '@smui/switch';
    import FormField from '@smui/form-field';
    import HelperText from '@smui/textfield/helper-text';
    import { dialogs } from 'svelte-dialogs';
    import { getNotificationsContext } from 'svelte-notifications';
    import { _ } from 'svelte-i18n';

    import { Parameter, parameters } from '../../../data/parameters';
    import ParameterArgumentDialog from '../../ParameterArgumentDialog.svelte';

    export let strictMode = true;
    export let parameterErrorMessage = null;
    export let launchParameters = '';

    const { addNotification, removeNotification } = getNotificationsContext();

    $: launchParameters = strictMode ? launchParameters.replace(/  +/g, ' ') : launchParameters;
    $: inputParameters = launchParameters.trim().split(' ');
    $: selected = parameters.filter((value) => inputParameters.some((v) => value.matches(v)));
    $: {
        parameterErrorMessage = null;

        if (Boolean('' !== launchParameters.trim() && inputParameters)) {
            inputParameters.every((input) => {
                if (!parameters.some((parameter) => parameter.matches(input))) {
                    parameterErrorMessage = $_('parameters.invalid', { values: { input } });

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
                    api.logs().error(e);

                    removeNotification('launch-error');
                    addNotification({
                        id: 'launch-error',
                        text: $_('common.something_went_wrong'),
                        position: 'top-center',
                        removeAfter: 5000,
                        type: 'danger'
                    });
                } finally {
                    if (typeof argument === 'string' && 0 < currentParameters.length) {
                        const lastElement = currentParameters[currentParameters.length - 1];

                        currentParameters.splice(-1, 1, argument ? `${lastElement}=${argument}` : `${lastElement}`);
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
        launchParameters = launchParameters.trim();
    }
</script>

<Textfield
    label={$_('parameters')}
    bind:value={launchParameters}
    type="text"
    style="width: 100%;"
    helperLine$style="width: 100%;"
    invalid={Boolean(strictMode && parameterErrorMessage)}
    textarea
>
    <HelperText slot="helper" style="color: #b00020;">
        {#if strictMode}
            {parameterErrorMessage ?? ''}
        {/if}
    </HelperText>
</Textfield>
<FormField>
    <Switch bind:checked={strictMode} />
    <span slot="label">{$_('parameters.enable_strict_mode')}</span>
</FormField>
<Set chips={parameters} let:chip key={(chip) => chip.key} {selected} filter on:SMUIChip:selection={handleChipSelection}>
    <Wrapper rich>
        <Chip {chip} touch shouldFocusPrimaryActionOnClick={false} shouldRemoveOnTrailingIconClick={false}>
            <ChipText>{chip.key}</ChipText>
        </Chip>
        <Tooltip xPos="center" yPos="above" showDelay={1000} hideDelay={100}>
            <TooltipContent>
                {chip.description ? $_(`parameter.description.${chip.description}`) : $_('parameter.no_description')}
            </TooltipContent>
        </Tooltip>
    </Wrapper>
</Set>
