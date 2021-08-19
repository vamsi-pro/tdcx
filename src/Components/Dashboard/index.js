import React, { useState, useEffect } from 'react'

// tools
import { useHistory } from 'react-router-dom'
import { uid } from 'react-uid'

// icons
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'

// components
import Card from '../Card'
import ModalComponent from '../Modal'

// configs
import { dashboard } from '../../configs/constant'
import { Avatar } from '@material-ui/core'
import {
    fetchTaskList,
    fetchDashboardList,
    updateTask,
    deleteTask,
} from '../../services'

// styles
import './styles.scss'
import { toast } from 'react-toastify'

const Dashboard = ({ setAuthToken }) => {
    const [users, setUsers] = useState(null)
    const [tasks, setTasks] = useState([])
    const [open, setOpen] = useState(false)
    const [dashboardData, setDashboardData] = useState([])
    const [doneTask, setDoneTask] = useState([])
    const [updateList, setUpdateList] = useState(false)
    const [searchName, setSearchName] = useState('')
    const history = useHistory()

    const onAddTask = () => {
        setOpen(true)
    }

    const onLogout = () => {
        history.push('/')
        localStorage.removeItem('user')
        setAuthToken(false)
    }

    const onCompleteTask = (id) => () => {
        console.log('doneTask', id)
        let list = []
        if (id) {
            list.push(id)
        }
        setDoneTask([...doneTask, ...list])
        console.log(users?.token)
        updateTask(id, users?.token)
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
    }

    const onDeleteTask = (id) => () => {
        deleteTask(id, users?.token)
            .then((res) => {
                if (res) {
                    const { data } = res
                    toast.success(data.msg, { autoClose: 3000 })
                    setUpdateList(true)
                }
            })
            .catch((err) => {
                if (err) toast.warning('Please try again', { autoClose: 3000 })
            })
    }

    const searchList = (list) => {
        if (searchName !== '') {
            return list.filter((item) =>
                item.name.includes(searchName.toLowerCase())
            )
        }
        return list
    }

    useEffect(() => {
        if (updateList) {
            fetchTaskList()
                .then((res) => setTasks(res.data.tasks))
                .catch((err) => console.log(err))
        }
        setUpdateList(false)
    }, [updateList])

    useEffect(() => {
        const details = localStorage.getItem('user')
        if (details) {
            setUsers(JSON.parse(details))
        }
    }, [])

    useEffect(() => {
        if (users?.token) {
            fetchTaskList(users?.token)
                .then((res) => setTasks(res.data.tasks))
                .catch((err) => console.log(err))
        }
    }, [users])

    useEffect(() => {
        if (users?.token) {
            fetchDashboardList(users?.token)
                .then((res) => {
                    if (res) setDashboardData(res.data)
                })
                .catch((err) => console.log(err))
        }
    }, [users])

    return (
        <div className="dashboard">
            <nav className="navbar navbar-expand-lg bg-white py-3 px-5 justify-content-between">
                <div className="d-flex title">
                    <Avatar alt={users?.image} src={users?.image} />
                    <h5 className="text-muted mx-3 pt-2 text-capitalize">
                        {users?.name}
                    </h5>
                </div>
                <p className="logout mb-0" onClick={onLogout}>
                    {dashboard.logout}
                </p>
            </nav>

            {tasks.length > 0 ? (
                <div className="container mx-auto">
                    <div className="mt-4 task-cards">
                        <Card>
                            Tasks Completed
                            <p className="text-primary complete">
                                {dashboardData?.tasksCompleted}/
                                {dashboardData?.totalTasks}
                            </p>
                        </Card>
                        <Card>
                            Latest Created Tasks
                            <ul>
                                {searchList(tasks)
                                    .slice(0, 3)
                                    .map((list, index) => (
                                        <li key={uid(list, index)}>
                                            {list.name}
                                        </li>
                                    ))}
                            </ul>
                        </Card>
                        <Card>Latest Created Tasks</Card>
                    </div>
                    <div className="pt-5">
                        <div className="d-flex justify-content-between">
                            <p>Tasks</p>
                            <div className="d-flex">
                                <div className="form-group mr-5 w-100">
                                    <input
                                        type="text"
                                        name="name"
                                        onChange={(e) =>
                                            setSearchName(e.target.value)
                                        }
                                        className="form-control"
                                        placeholder="Search by task name"
                                    />
                                </div>
                                <button
                                    className="btn btn-primary rounded w-75 h-75"
                                    onClick={onAddTask}
                                >
                                    {`+ ${dashboard.button}`}
                                </button>
                            </div>
                        </div>
                        <div className="card bg-white w-100 listcard overflow-auto p-3">
                            {searchList(tasks).map((list, index) => (
                                <div
                                    key={uid(list, index)}
                                    className={`list px-3 py-2 text-primary d-flex justify-content-between ${
                                        index !== tasks.length - 1
                                            ? 'border-bottom'
                                            : ''
                                    }`}
                                >
                                    <div className="form-check">
                                        <input
                                            className="form-check-input mt-2 mr-3"
                                            type="checkbox"
                                            value=""
                                            onClick={onCompleteTask(list._id)}
                                            id="flexCheckDefault"
                                        />
                                        <p className="pl-2 mb-1">{list.name}</p>
                                    </div>

                                    <div className="d-flex">
                                        <EditIcon className="icon mx-3" />
                                        <DeleteIcon
                                            className="icon"
                                            onClick={onDeleteTask(list._id)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card bg-white taskcard mx-auto p-5">
                    <p className="text-center h-50">{dashboard.taskTitle}</p>
                    <button
                        className="btn btn-primary w-50 m-auto"
                        onClick={onAddTask}
                    >{`+ ${dashboard.button}`}</button>
                </div>
            )}
            <ModalComponent
                open={open}
                setOpen={setOpen}
                token={users?.token}
                setUpdateList={setUpdateList}
            />
        </div>
    )
}

export default Dashboard
