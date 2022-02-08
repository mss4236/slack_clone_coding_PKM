import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback } from 'react';
import useSWR from 'swr';

const Workspace = () => {
    const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);  // fetcher에 앞의 주소를 어떻게 처리할지 // 데이터가 존재하지 않으면 로딩중...

    const onLogout = useCallback(() => {
        axios.post('http://localhost:3095/api/logout', null, {
            withCredentials: true,
        })
            .then(() => {
                mutate();
            });
    }, []);

    return (
        <div>
            <div>로그인하고 두고두고 쓰일 workspace</div>
            <button onClick={onLogout}>로그아웃</button>
        </div>
    );
};

export default Workspace;