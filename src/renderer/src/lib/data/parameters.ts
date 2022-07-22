export const parameters: Parameter[] = [
    {
        key: '-ai_view',
        matches: (value) => /-ai_view\b/.test(value)
    },
    {
        key: '-allowoldsave',
        description: 'allowoldsave',
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
        description: 'autosave',
        argument: {
            allowAny: false,
            choices: ['NEVER', 'DAILY', 'WEEKLY', 'MONTHLY', 'HALFYEAR', 'YEARLY'],
            matches: (value) => /^\b(NEVER|DAILY|WEEKLY|MONTHLY|HALFYEAR|YEARLY)\b$/.test(value)
        }
    },
    {
        key: '-autosave_count',
        matches: (value) => /^-autosave_count=\b[0-9]*\b$/.test(value),
        description: 'autosave_count',
        argument: {
            allowAny: true,
            description: 'autosave_count',
            matches: (value) => /^\b[0-9]*\b$/.test(value)
        }
    },
    {
        key: '-checksum',
        description: 'checksum',
        matches: (value) => /^-checksum\b$/.test(value)
    },
    {
        key: '-crash_data_log',
        description: 'crash_data_log',
        matches: (value) => /^-crash_data_log\b$/.test(value)
    },
    {
        key: '-debug',
        description: 'debug',
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
