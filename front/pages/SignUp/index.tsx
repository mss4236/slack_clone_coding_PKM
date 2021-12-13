import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from './style';
import useChange from '@hooks/useChange';

const SignUp = () => {
    // const [email, setEmail] = useState('');
    // const [nickname, setNickname] = useState('');
    const [email, onChangeEmail] = useChange('');
    const [nickname, onChangeNickname] = useChange('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [mismatchError, setMismatchError] = useState(false);
    const [signupError, setSignupError] = useState('');
    const [signupSuccess, setSignupSuccess] = useState(false);

    // const onChangeEmail = useCallback((e) => {
    //     setEmail(e.target.value);
    // }, []);

    // const onChangeNickname = useCallback((e) => {
    //     setNickname(e.target.value);
    // }, []);

    const onChangePassword = useCallback((e) => {
        setPassword(e.target.value);
        if(passwordCheck !== '') setMismatchError(e.target.value !== passwordCheck);
    }, [passwordCheck]);

    const onChangePasswordCheck = useCallback((e) => {
        setPasswordCheck(e.target.value);
        if(e.target.value !== '') setMismatchError(e.target.value !== password);
    }, [password]);

    const onSubmit = useCallback((e) => {
        e.preventDefault();

        if(!mismatchError && nickname) {
            setSignupError(''); // 비동기 안에 들어있는 setState같은거는 비동기요청하기 전에 초기화 해주는게 좋음 (요청은 연속적으로 날리는 경우에 그전에 남아있던게 다음 요청에도 그대로 남아있는 경우가 있기 때문)
            setSignupSuccess(false);
            // backend의 회원가입 주소로 데이터 전송
            axios.post('/api/users', {email, nickname, password})
            .then((response) => {
                setSignupSuccess(true);
            }) // 전송 성공시
            .catch((error) => {
                setSignupError(error.response.data);
            }) // 전송 실패시
            .finally(() => {}); // 무조건
        }
        
    }, [email, nickname, password, passwordCheck]);



    return(
        <div id="container">
            <Header>Sleact</Header>
            <Form onSubmit={onSubmit}>
                <Label id="email-label">
                    <span>이메일 주소</span>
                    <div>
                        <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
                    </div>
                </Label>
                <Label id="nickname-label">
                    <span>닉네임</span>
                    <div>
                        <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
                    </div>
                </Label>
                <Label id="password-label">
                    <span>비밀번호</span>
                    <div>
                        <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} /> 
                    </div>
                </Label>
                <Label id="passwordCheck-label">
                    <span>비밀번호 확인</span>
                    <div>
                        <Input type="password" id="passwordCheck" name="passwordCheck" value={passwordCheck} onChange={onChangePasswordCheck}></Input>
                    </div>
                    {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
                    {!nickname && <Error>닉네임을 입력해주세요.</Error>}
                    {signupError && <Error>{signupError}</Error>}
                    {signupSuccess && <Success>회원가입되었습니다. 로그인해주세요.</Success>}
                </Label>
                <Button type="submit">회원가입</Button>
            </Form>
            <LinkContainer>
                이미 회원이신가요? &nbsp;
                <a href="/login">로그인 하러가기</a>
            </LinkContainer>
        </div>
        );
    };
    
export default SignUp;