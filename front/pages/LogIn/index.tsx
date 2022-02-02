import { Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/style';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import useChange from '@hooks/useChange';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const LogIn = () => {
    const {data, error, mutate} = useSWR('http://localhost:3095/api/users', fetcher, { dedupingInterval:100000});  // fetcher에 앞의 주소를 어떻게 처리할지 // 데이터가 존재하지 않으면 로딩중...
    const [email, onChangeEmail] = useChange('');
    const [password, onChangePassword] = useChange('');
    const [loginError, setLoginError] = useState(false);

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        setLoginError(false);
        
        axios.post('http://localhost:3095/api/users/login', {email, password}, {withCredentials: true})
        .then((reponse) => {
            mutate();
        }) 
        .catch((error) => {
            setLoginError(error.response?.data?.code === 401);
        })
        .finally(() => {});
    }, [email, password]);

    return (
        <div id="container">
            <Header>Sleact</Header>
            <Form onSubmit={onSubmit}>
                <Label id="email-label">
                    <span>이메일 주소</span>
                    <div>
                        <Input type="email" id='email' name='email' value={email} onChange={onChangeEmail} />
                    </div>
                </Label>
                <Label id="password-label">
                    <span>비밀번호</span>
                    <div>
                        <Input type="password" id='password' name='password' value={password} onChange={onChangePassword} />
                    </div>
                </Label>
                {loginError && <Error>이메일 또는 비밀번호가 일치하지 않습니다.</Error>}
                <Button type='submit'>로그인</Button>
            </Form>
            <LinkContainer>
                아직 회원이 아니신가요? &nbsp;
                <Link to="/signup">회원가입 하러가기</Link>
            </LinkContainer>
        </div>
    );
};

export default LogIn;