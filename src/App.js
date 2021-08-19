import React, { useState, useEffect } from 'react'

// tools
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from 'react-router-dom'

// components
import Login from './Components/Login'
import Dashboard from './Components/Dashboard'

const App = () => {
    const [authToken, setAuthToken] = useState(false)

    useEffect(() => {
        const details = localStorage.getItem('user')
        if (details) {
            setAuthToken(true)
        }
    }, [authToken])

    console.log(authToken)
    return (
        <div>
            <div className="app">
                <Router>
                    <Switch>
                        <Route
                            exact
                            path="/"
                            component={() => (
                                <Login setAuthToken={setAuthToken} />
                            )}
                        />
                        {authToken ? (
                            <Route
                                exact
                                path="/dashboard"
                                component={() => (
                                    <Dashboard
                                        setAuthToken={setAuthToken}
                                        authToken={authToken}
                                    />
                                )}
                            />
                        ) : (
                            <Redirect to="/" />
                        )}
                    </Switch>
                </Router>
            </div>
        </div>
    )
}

export default App
