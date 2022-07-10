<script lang="ts">
    import Button, { Label } from '@smui/button';
    import Chip, { Set, Text } from '@smui/chips';
    import Textfield from '@smui/textfield';

    const hoi4Path = 'D:/Windows/Programmes/steamapps/common/Hearts of Iron IV/hoi4.exe';
    const choices = ['-debug', '-checksum'];

    let parameters = '';
    let selected = [];

    function launchHoi4() {
        try {
            api.launchHoi4(hoi4Path, parameters.split(' '));
        } catch (e) {
            console.error(e);
            // TODO handle error
        }
    }

    function handleInputChange(e: any) {
        const inputParameters = e.target.value.trim().split(' ');

        selected = choices.filter((choice) => inputParameters.includes(choice));
    }

    function handleChipSelection(e: any) {
        const chipDetails = e.detail;
        const inputParameters = parameters.trim().split(' ');

        if (chipDetails.selected && !inputParameters.includes(chipDetails.chipId)) {
            parameters = `${parameters} ${chipDetails.chipId}`.trim();
        } else if (!chipDetails.selected && inputParameters.includes(chipDetails.chipId)) {
            parameters = parameters.replace(chipDetails.chipId, '').trim();
        }
    }
</script>

<main>
    <Textfield
        label="Parameters"
        bind:value={parameters}
        on:input={handleInputChange}
        type="text"
    />
    <Set chips={choices} let:chip filter bind:selected on:SMUIChip:selection={handleChipSelection}>
        <Chip {chip} touch>
            <Text>{chip}</Text>
        </Chip>
    </Set>
    <Button variant="outlined" on:click={launchHoi4}><Label>Launch HOI4</Label></Button>
</main>
