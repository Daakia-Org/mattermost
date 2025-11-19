// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useMemo, useCallback} from 'react';
import type {OnChangeValue, GroupBase} from 'react-select';
import CreatableSelect from 'react-select/creatable';

import Setting from './setting';

type Option = {
    label: string;
    value: string;
}

type Props = {
    id: string;
    value: string[] | string | undefined;
    onChange: (id: string, valueAsArray: string[]) => void;
    disabled: boolean;
    setByEnv: boolean;
    label: React.ReactNode;
    helpText?: React.ReactNode;
    placeholder?: string;
}

const VersionBlockSetting: React.FC<Props> = ({
    id,
    value,
    onChange,
    disabled,
    setByEnv,
    label,
    helpText,
    placeholder,
}) => {
    const arrayValue = useMemo(() => {
        if (!value) {
            return [];
        }
        if (Array.isArray(value)) {
            return value;
        }

        // Fallback: if value is a string (from old format), convert it
        if (typeof value === 'string') {
            return value.split(',').map((v: string) => v.trim()).filter(Boolean);
        }
        return [];
    }, [value]);

    const options = useMemo(() => {
        return arrayValue.map((v: string) => ({
            label: v,
            value: v,
        }));
    }, [arrayValue]);

    const handleChange = useCallback((newValue: OnChangeValue<Option, true>) => {
        const updatedValues = newValue ? (newValue as Option[]).map((n) => n.value) : [];
        onChange(id, updatedValues);
    }, [id, onChange]);

    const handleCreateOption = useCallback((inputValue: string) => {
        const trimmed = inputValue.trim();
        if (trimmed && !arrayValue.includes(trimmed)) {
            onChange(id, [...arrayValue, trimmed]);
        }
    }, [id, arrayValue, onChange]);

    return (
        <Setting
            label={label}
            inputId={id}
            helpText={helpText}
            setByEnv={setByEnv}
        >
            <CreatableSelect<Option, true, GroupBase<Option>>
                id={id}
                isMulti={true}
                isClearable={false}
                isDisabled={disabled || setByEnv}
                onChange={handleChange}
                onCreateOption={handleCreateOption}
                value={options}
                placeholder={placeholder || 'Type and press Enter to add a version...'}
                noOptionsMessage={() => 'Type to create a new version'}
                formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                isValidNewOption={(inputValue) => {
                    const trimmed = inputValue.trim();
                    return trimmed.length > 0 && !arrayValue.includes(trimmed);
                }}
            />
        </Setting>
    );
};

export default React.memo(VersionBlockSetting);

