export const parameters: Parameter[] = [
    {
        key: '-ai_view',
        matches: (value) => /-ai_view\b/.test(value)
    },
    {
        key: '-allowoldsave',
        description:
            'Allows save games with older save game versions to be loaded with only a tooltip warning, instead of blocking them altogether. Especially useful for testing shortly after increasing the save game version, since recent save games will still be loadable and relevant.',
        matches: (value) => /^-allowoldsave(s)?\b$/.test(value)
    },
    {
        key: '-audiodebug',
        matches: (value) => /^-audiodebug\b$/.test(value)
    },
    {
        key: '-auto_run',
        matches: (value) => /^-auto_run=[A-Za-z0-9]+\b$/.test(value),
        argument: {
            allowAny: true,
            matches: (value) => /^[A-Za-z0-9]+\b$/.test(value)
        }
    },
    {
        key: '-autosave',
        matches: (value) => /^-autosave=\b(NEVER|DAILY|WEEKLY|MONTHLY|HALFYEAR|YEARLY)\b$/.test(value),
        description: "Overrides the autosave interval in the user's settings.txt file.",
        argument: {
            allowAny: false,
            choices: ['NEVER', 'DAILY', 'WEEKLY', 'MONTHLY', 'HALFYEAR', 'YEARLY'],
            matches: (value) => /^\b(NEVER|DAILY|WEEKLY|MONTHLY|HALFYEAR|YEARLY)\b$/.test(value)
        }
    },
    {
        key: '-debug',
        matches: (value) => /^-debug\b$/.test(value)
    }
];

export interface Parameter {
    key: string;
    description?: string;
    matches: (value: string) => boolean;
    deprecated?: boolean;
    argument?: ParameterArgument;
}

export interface ParameterArgument {
    allowAny: boolean;
    choices?: string[];
    description?: string;
    matches?: (value: string) => boolean;
}
