import React, { useState } from 'react';
import './RegisterPage.css'
import { FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa'
import { db } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const RegisterPage = () => {
    const [dataForm, setDataForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [sucessMessage, setSucessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }
    const handleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    // Armazena todas as mudanças feitas nos campos inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataForm(prevData => ({
            ...prevData,
            [name]: value,

        }));
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        }
    };

    //Realiza a avaliação dos dados nos campos
    const validation = () => {
        let newErrors = {};
        if (!dataForm.username) {
            newErrors.username = 'Campo Não preenchido';
        }

        if (!dataForm.email) {
            newErrors.email = 'Campo Não preenchido';
        }

        if (!dataForm.password) {
            newErrors.password = 'Campo Não preenchido';
        } else if (dataForm.password.length < 6) {
            newErrors.password = 'Quantidade de caracteres invalidos, precisa ser no minimo 6';
        }

        if (dataForm.password !== dataForm.confirmPassword) {
            newErrors.confirmPassword = 'Senhas não são compativeis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;

    };

    // Reliza o envio dos dados

    const handlSubmit = async (e) => {
        e.preventDefault();
        if (!validation()) {
            return;
        }

        setLoading(true);
        setSucessMessage('');
        setErrors({});

        try {
            const userData = {
                username: dataForm.username,
                email: dataForm.email,
                password: dataForm.password,
                createdAt: new Date()

            };
            await addDoc(collection(db, "users"), userData);

            setSucessMessage('usuario cadastrado com sucesso!')
            setDataForm({
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
            })

        } catch (error) {
            setErrors({ general: 'Ocorreu um erro tente novamente' });
            console.error('Erro ao enviar dados para o firebase:', error);
        } finally {
            setLoading(false);
        }
    };



    return (

        <div className="body_registerPage">
            <div className='links'>
                <a href='/'>Home|</a>
                <a href='/'>About|</a>
                <a href='/'>Contact Us|</a>
            </div>
            <div className=" form-container">
                <form className="form" onSubmit={handlSubmit}>
                    <h1>Sign-Up</h1>
                    <label htmlFor='username'>Nome:</label>
                    <input type="text" id='username' name='username' value={dataForm.username} onChange={handleChange} className={errors.username ? 'input-error' : ''} />
                    {errors.username && <p className='error-message'>{errors.username}</p>}

                    <label>E-mail:</label>
                    <input type="email" id='email' name='email' value={dataForm.email} onChange={handleChange} className={errors.email ? 'input-error' : ''} />
                    {errors.email && <p className='error-message'>{errors.email}</p>}


                    <label>Senha:</label>
                    <div>
                        <input type={showPassword ? "text" : "password"} id='password' name='password' value={dataForm.password} onChange={handleChange} className={errors.password ? 'input-error' : ''} />
                        <button type="button" className='showPassword-button' onClick={handleShowPassword}>{showPassword ? <FaEye size="20"/> : <FaEyeSlash size="20"/>}</button>
                    </div>
                    {errors.password && <p className='error-message'>{errors.password}</p>}

                    <label>Confirme a Senha:</label>

                    <div>
                        <input type={showConfirmPassword ? "text" : "password"} id='confirmPassword' name='confirmPassword' value={dataForm.confirmPassword} onChange={handleChange} className={errors.confirmPassword ? 'input-error' : ''} />
                        <button type="button" className='showPassword-button' onClick={handleShowConfirmPassword}>{showConfirmPassword ? <FaEye size="20"/> : <FaEyeSlash size="20"/>}</button>
                    </div>
                    {errors.confirmPassword && <p className='error-message'>{errors.confirmPassword}</p>}

                    <button type="submit" className='submit-button' disabled={loading}>{loading ? 'Resgistrando...' : 'Registrar'}</button>
                    {errors.general && <p> {errors.general}</p>}
                    {sucessMessage && <p> {sucessMessage}</p>}

                    <div className='icons'>
                        <a href="https://github.com/LucassSN" className="icon"><FaGithub size="30" /></a>

                    </div>

                </form>


            </div>
        </div>



    )
}
export default RegisterPage;