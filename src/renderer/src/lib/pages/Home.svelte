<script lang="ts">
    import Button, { Label as ButtonLabel } from '@smui/button';
    import Chip, { Set, Text as ChipText } from '@smui/chips';
    import Textfield from '@smui/textfield';
    import Tooltip, { Wrapper, Content as TooltipContent } from '@smui/tooltip';
    import Dialog, {
        Title,
        Content as DialogContent,
        Actions as DialogActions,
        InitialFocus
    } from '@smui/dialog';
    import Switch from '@smui/switch';
    import FormField from '@smui/form-field';
    import List, { Item, Graphic, Text as ListText } from '@smui/list';
    import Radio from '@smui/radio';
    import HelperText from '@smui/textfield/helper-text';
    import Snackbar, { Actions as SnackbarActions, Label as SnackbarLabel } from '@smui/snackbar';
    import IconButton from '@smui/icon-button';

    import type { SnackbarComponentDev } from '@smui/snackbar';

    import { Parameter, parameters } from '../data/parameters';

    const hoi4Path = 'D:/Windows/Programmes/steamapps/common/Hearts of Iron IV/hoi4.exe';

    let launchParameters = '';
    let strictMode = true;
    let argumentErrorMessage = null;
    let parameterErrorMessage = null;
    let errorSnackbar: SnackbarComponentDev;
    let parametersArgumentOpened = parameters.reduce<object>(function (filtered, option) {
        if (option.argument) {
            filtered[option.key] = {
                opened: false,
                selectedValue: ''
            };
        }

        return filtered;
    }, {});

    $: inputParameters = launchParameters.trim().split(' ');
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

    function launchHoi4() {
        try {
            api.launchHoi4(hoi4Path, launchParameters.split(' '));
        } catch (e) {
            console.error(e);
            errorSnackbar.open();
            // TODO handle error
        }
    }

    function handleChipSelection(e: any) {
        const chipDetails = e.detail;
        const parameter: Parameter = chipDetails.chipId;

        let currentParameters = inputParameters;

        if (chipDetails.selected) {
            if (!currentParameters.some((value) => parameter.matches(value))) {
                currentParameters = [...currentParameters, parameter.key];
            }

            if (parameter.argument) {
                parametersArgumentOpened[parameter.key].opened = true;
            }
        } else {
            if (parameter.argument) {
                parametersArgumentOpened[parameter.key].opened = false; // just in case
            }

            currentParameters = currentParameters.filter((value) => !parameter.matches(value));
        }

        launchParameters = currentParameters.join(' ').trim();
    }

    function handleDialogClose(e: any, parameter: Parameter) {
        const details = e.detail;

        let currentParameters = inputParameters;

        if ('cancel' === details.action) {
            currentParameters.pop();
        } else if (0 < currentParameters.length) {
            const lastElement = currentParameters[currentParameters.length - 1];
            const argumentValue = parametersArgumentOpened[parameter.key].selectedValue;

            currentParameters.splice(-1, 1, `${lastElement}=${argumentValue}`);
        }

        launchParameters = currentParameters.join(' ').trim();
        parametersArgumentOpened[parameter.key].opened = false;
    }
</script>

<h1>Home</h1>
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
<Set
    chips={parameters}
    let:chip
    key={(chip) => chip.key}
    filter
    {selected}
    on:SMUIChip:selection={handleChipSelection}
>
    <Wrapper rich>
        <Chip
            {chip}
            touch
            shouldFocusPrimaryActionOnClick={false}
            shouldRemoveOnTrailingIconClick={false}
        >
            <ChipText>{chip.key}</ChipText>
        </Chip>
        <Tooltip>
            <TooltipContent>{chip.description ?? 'No description provided.'}</TooltipContent>
        </Tooltip>
    </Wrapper>
    {#if chip.argument}
        <Dialog
            open={true === parametersArgumentOpened[chip.key].opened}
            aria-labelledby={`argument-title-${chip.key}`}
            aria-describedby={`argument-content-${chip.key}`}
            scrimClickAction=""
            escapeKeyAction=""
            on:SMUIDialog:closed={(e) => handleDialogClose(e, chip)}
        >
            <Title id={`argument-title-${chip.key}`}>This parameter requires an argument</Title>
            <DialogContent id={`argument-content-${chip.key}`}>
                {#if chip.argument.description}
                    <p>{chip.argument.description}</p>
                {/if}
                {#if chip.argument.allowAny}
                    <Textfield
                        label="Argument"
                        bind:value={parametersArgumentOpened[chip.key].selectedValue}
                        type="text"
                        invalid={Boolean(strictMode && argumentErrorMessage)}
                    />
                {:else}
                    <List radioList>
                        {#each chip.argument.choices as choice}
                            <Item>
                                <Graphic>
                                    <Radio
                                        bind:group={parametersArgumentOpened[chip.key]
                                            .selectedValue}
                                        value={choice}
                                    />
                                </Graphic>
                                <ListText>{choice}</ListText>
                            </Item>
                        {/each}
                    </List>
                {/if}
            </DialogContent>
            <DialogActions>
                <Button action="cancel">
                    <ButtonLabel>Cancel</ButtonLabel>
                </Button>
                <Button
                    action="confirm"
                    defaultAction
                    use={[InitialFocus]}
                    disabled={Boolean(argumentErrorMessage)}
                >
                    <ButtonLabel>Confirm</ButtonLabel>
                </Button>
            </DialogActions>
        </Dialog>
    {/if}
</Set>
<Button
    variant="outlined"
    on:click={launchHoi4}
    disabled={Boolean(strictMode && parameterErrorMessage)}
>
    <ButtonLabel>Launch HOI4</ButtonLabel>
</Button>
<Snackbar bind:this={errorSnackbar} surface$color="red">
    <SnackbarLabel>Something wrong happened while launching the game.</SnackbarLabel>
    <SnackbarActions>
        <IconButton class="material-icons" title="Dismiss">close</IconButton>
    </SnackbarActions>
</Snackbar>
