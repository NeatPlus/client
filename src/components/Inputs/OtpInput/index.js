import React, {memo, useState, useCallback} from 'react';
import SingleInput from './SingleInput';

export function OTPInputComponent(props) {
    const {
        length,
        isNumberInput,
        autoFocus,
        disabled,
        onChangeOTP,
        inputClassName,
        inputStyle,
        ...rest
    } = props;

    const [activeInput, setActiveInput] = useState(0);
    const [otpValues, setOTPValues] = useState(Array(length).fill(''));

    const handleOtpChange = useCallback(
        (otp) => {
            const otpValue = otp.join('');
            onChangeOTP(otpValue);
        },
        [onChangeOTP]
    );

    const getRightValue = useCallback(
        (str) => {
            let changedValue = str;
            if (!isNumberInput) {
                return changedValue;
            }
            return !changedValue || /\d/.test(changedValue) ? changedValue : '';
        },
        [isNumberInput]
    );

    const changeCodeAtFocus = useCallback(
        (str) => {
            const updatedOTPValues = [...otpValues];
            updatedOTPValues[activeInput] = str[0] || '';
            setOTPValues(updatedOTPValues);
            handleOtpChange(updatedOTPValues);
        },
        [activeInput, handleOtpChange, otpValues]
    );

    const focusInput = useCallback(
        (inputIndex) => {
            const selectedIndex = Math.max(Math.min(length - 1, inputIndex), 0);
            setActiveInput(selectedIndex);
        },
        [length]
    );

    const focusPrevInput = useCallback(() => {
        focusInput(activeInput - 1);
    }, [activeInput, focusInput]);

    const focusNextInput = useCallback(() => {
        focusInput(activeInput + 1);
    }, [activeInput, focusInput]);

    const handleOnFocus = useCallback(
        (index) => () => {
            focusInput(index);
        },
        [focusInput]
    );

    const handleOnChange = useCallback(
        (e) => {
            const val = getRightValue(e.currentTarget.value);
            if (!val) {
                e.preventDefault();
                return;
            }
            changeCodeAtFocus(val);
            focusNextInput();
        },
        [changeCodeAtFocus, focusNextInput, getRightValue]
    );

    const onBlur = useCallback(() => {
        setActiveInput(-1);
    }, []);

    const handleOnKeyDown = useCallback(
        (e) => {
            switch (e.key) {
            case 'Backspace':
            case 'Delete': {
                e.preventDefault();
                if (otpValues[activeInput]) {
                    changeCodeAtFocus('');
                } else {
                    focusPrevInput();
                }
                break;
            }
            case 'ArrowLeft': {
                e.preventDefault();
                focusPrevInput();
                break;
            }
            case 'ArrowRight': {
                e.preventDefault();
                focusNextInput();
                break;
            }
            case ' ': {
                e.preventDefault();
                break;
            }
            default:
                break;
            }
        },
        [
            activeInput,
            changeCodeAtFocus,
            focusNextInput,
            focusPrevInput,
            otpValues,
        ]
    );

    const handleOnPaste = useCallback(
        (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData
                .getData('text/plain')
                .trim()
                .slice(0, length - activeInput)
                .split('');
            if (pastedData) {
                let nextFocusIndex = 0;
                const updatedOTPValues = [...otpValues];
                updatedOTPValues.forEach((val, index) => {
                    if (index >= activeInput) {
                        const changedValue = getRightValue(
                            pastedData.shift() || val
                        );
                        if (changedValue) {
                            updatedOTPValues[index] = changedValue;
                            nextFocusIndex = index;
                        }
                    }
                });
                setOTPValues(updatedOTPValues);
                handleOtpChange(updatedOTPValues);
                setActiveInput(Math.min(nextFocusIndex + 1, length - 1));
            }
        },
        [activeInput, getRightValue, length, otpValues, handleOtpChange]
    );

    return (
        <div {...rest}>
            {Array(length)
                .fill('')
                .map((_, index) => (
                    <SingleInput
                        key={`SingleInput-${index}`}
                        focus={activeInput === index}
                        value={otpValues && otpValues[index]}
                        autoFocus={autoFocus}
                        onFocus={handleOnFocus(index)}
                        onChange={handleOnChange}
                        onKeyDown={handleOnKeyDown}
                        onBlur={onBlur}
                        onPaste={handleOnPaste}
                        style={inputStyle}
                        className={inputClassName}
                        disabled={disabled}
                    />
                ))}
        </div>
    );
}

const OTPInput = memo(OTPInputComponent);
export default OTPInput;
