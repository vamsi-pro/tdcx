import React, { useEffect, useState } from 'react'

// tools
import axios from 'axios'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

// configs
import { login, tdcxAPI } from '../../configs/constant'

// styles
import './styles.scss'

const Login = ({ setAuthToken }) => {
    const [userdetails, setUserDetails] = useState({ id: '', name: '' })
    const [response, setResponse] = useState(null)

    const history = useHistory()

    const onChangeHandler = (e) => {
        const { name } = e.target
        setUserDetails({ ...userdetails, [name]: e.target.value })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (userdetails.id !== '' && userdetails.name !== '') {
            const data = { name: userdetails.name, apiKey: userdetails.id }
            axios
                .post(`${tdcxAPI}/login`, data)
                .then((res) => {
                    if (res) {
                        const { data } = res
                        setResponse(res.data)
                        toast.success(data.msg, { autoClose: 3000 })
                        setAuthToken(true)
                        history.push('/dashboard')
                    }
                })
                .catch((err) => console.log(err))
        }
    }

    useEffect(() => {
        if (response) {
            const { name, token } = response?.token
            localStorage.setItem(
                'user',
                JSON.stringify({ image: response.image, name, token })
            )
        }
    }, [response])

    toast.configure()

    return (
        <div className="card mx-auto bg-white login p-3">
            <div className="card-body login-title pl-1">{login.title}</div>
            <div className="form-group">
                <input
                    type="text"
                    name={login.id}
                    value={userdetails.id}
                    onChange={onChangeHandler}
                    className="form-control"
                    placeholder="Id"
                />
            </div>
            <div className="form-group">
                <input
                    type={login.name}
                    name="name"
                    value={userdetails.name}
                    onChange={onChangeHandler}
                    className="form-control"
                    placeholder={login.name}
                />
            </div>
            <button
                type="button"
                className="btn btn-primary rounded my-2"
                onClick={onSubmit}
            >
                {login.title}
            </button>
        </div>
    )
}

Login.propTypes = {
    setAuthToken: PropTypes.func,
}

export default Login
