import { useState } from "react";
import { executeRequest } from "../services/api";
import { NextPage } from "next";
import { Modal } from "react-bootstrap";
import { AccessTokenProps } from "../types/AccessTokenProps";

/* eslint-disable @next/next/no-img-element */
export const Login: NextPage<AccessTokenProps> = ({
    setToken
}) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setLoading] = useState(false);

    // states do modal/form
    const [showModal, setShowModal] = useState(false);
    const [isRegisterLoading, setRegisterLoading] = useState(false)
    const [registerSucessMessage, setRegisterSucessMessage] = useState('');
    const [registerErrorMessage, setRegisterErrorMessage] = useState('');
    const [nameModal, setNameModal] = useState('');
    const [emailModal, setEmailModal] = useState('');
    const [passwordModal, setPasswordModal] = useState('');
    const [passwordConfirmedModal, setPasswordConfirmedModal] = useState('');

    const doLogin = async () => {
        try {
            setLoading(true);
            setError('');
            if (!login && !password) {
                setError('Favor informar email e senha');
                setLoading(false);
                return;
            }

            const body = {
                login,
                password
            }

            const result = await executeRequest('login', 'POST', body);
            if (result && result.data) {
                localStorage.setItem('accessToken', result.data.token);
                localStorage.setItem('userName', result.data.name);
                localStorage.setItem('userMail', result.data.mail);
                setToken(result.data.token);
            } else {
                setError('Não foi possivel processar login, tente novamente');
            }
        } catch (e: any) {
            console.log(e);
            if (e?.response?.data?.error) {
                setError(e?.response?.data?.error);
            } else {
                setError('Não foi possivel processar login, tente novamente');
            }
        }

        setLoading(false);
    }

    const closeModal = () => {
        setNameModal('');
        setEmailModal('');
        setPasswordModal('');
        setPasswordConfirmedModal('');
        setShowModal(false);
        setRegisterErrorMessage('');
    }

    const doRegister = async() => {
        try {
            setRegisterLoading(true);
            setRegisterErrorMessage('');
            setRegisterSucessMessage('');

            if (!nameModal && !emailModal && !passwordModal) {
                setRegisterErrorMessage('Favor informar os dados para cadastro do usuario');
                setRegisterLoading(false);
                return;
            }

            if (passwordModal !== passwordConfirmedModal){
                setRegisterErrorMessage('As senhas informadas não coincidem');
                setRegisterLoading(false);
                return;
            }

            const body = {
                "name": nameModal,
                "email": emailModal,
                "password": passwordModal
            }

            const result = await executeRequest('user', 'POST', body);
            if (result && result.data) {
                setRegisterSucessMessage('Usuario criado com sucesso')
                closeModal();
            }

        } catch (e: any) {
            console.log(e);
            if (e?.response?.data?.error) {
                setRegisterErrorMessage(e?.response?.data?.error);
            } else {
                setRegisterErrorMessage('Não foi possivel cadastrar tarefa, tente novamente');
            }
        }
        setRegisterLoading(false);
    }
    return (
        <div className="container-login">
            <img src="/logo.svg" alt="Logo Fiap" className="logo" />
            <form>
                <p className="sucess">{registerSucessMessage}</p>
                <p className="error">{error}</p>
                <div className="input">
                    <img src="/mail.svg" alt="Informe seu email" />
                    <input type="text" placeholder="Informe seu email"
                        value={login} onChange={evento => setLogin(evento.target.value)} />
                </div>
                <div className="input">
                    <img src="/lock.svg" alt="Informe sua senha" />
                    <input type="password" placeholder="Informe sua senha"
                        value={password} onChange={evento => setPassword(evento.target.value)} />
                </div>
                <button type="button" onClick={doLogin} disabled={isLoading}
                    className={isLoading ? 'loading' : ''}>
                    {isLoading ? '...Carregando' : 'Login'}
                </button>
                <button type="button" 
                    onClick={() => setShowModal(true)}
                >Registrar-se
                </button>
                <Modal show={showModal}
                    onHide={() => closeModal()}
                    className="container-modal">
                    <Modal.Body>
                        <p>Cadastro</p>
                        {registerErrorMessage && <p className="error">{registerErrorMessage}</p>}
                        <input type="text"
                            placeholder="Nome"
                            value={nameModal}
                            onChange={e => setNameModal(e.target.value)} 
                        />
                        <input type="text"
                            placeholder="e-mail"
                            value={emailModal}
                            onChange={e => setEmailModal(e.target.value)}
                        />
                        <input type="password"
                            placeholder="Senha"
                            value={passwordModal}
                            onChange={e => setPasswordModal(e.target.value)}
                        />
                        <input type="password"
                            placeholder="Confirme a senha"
                            value={passwordConfirmedModal}
                            onChange={e => setPasswordConfirmedModal(e.target.value)}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="button col-12">
                            <button
                                onClick={doRegister}
                                disabled={isRegisterLoading}
                            >{isRegisterLoading ? "...Cadastrando" : "Cadastrar"}</button>
                            <span onClick={closeModal}>Cancelar</span>
                        </div>
                    </Modal.Footer>
                </Modal>
            </form>
        </div>
    )
}
