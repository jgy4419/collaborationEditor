// NicknameInput.tsx
import React from 'react';

type Props = {
    nickname: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const NicknameInput: React.FC<Props> = ({ nickname, onChange }) => {
    return (
        <input
            placeholder="닉네임을 입력!"
            value={nickname}
            onChange={onChange}
            style={{ marginBottom: '8px', display: 'block' }}
        />
    );
};

export default NicknameInput;
