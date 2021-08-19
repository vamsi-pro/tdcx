import React, { useState } from 'react'

// tools
import { Modal } from '@material-ui/core'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'

// services
import { createTask } from '../../services'
import { dashboard } from '../../configs/constant'

const ModalComponent = ({ open, setOpen, token, setUpdateList }) => {
    const [task, setTask] = useState('')
    toast.configure()

    const onSubmitTask = (e) => {
        e.preventDefault()
        createTask(task, token)
            .then((res) => {
                if (res) {
                    const { data } = res
                    toast.success(data.msg, { autoClose: 3000 })
                    setOpen(false)
                    setUpdateList(true)
                }
            })
            .catch((err) => {
                toast.warning('Error. Please try again', { autoClose: 3000 })
            })
    }

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div className="card bg-white p-4 modalCard mx-auto">
                <h4 className="modalTitle">+ New Task</h4>

                <div className="form-group w-100">
                    <input
                        type="text"
                        name="name"
                        className="form-control mt-2"
                        onChange={(e) => setTask(e.target.value)}
                        placeholder="task name"
                    />
                </div>
                <button
                    className="btn btn-primary w-100 mt-2 m-auto"
                    onClick={onSubmitTask}
                >{`+ ${dashboard.button}`}</button>
            </div>
        </Modal>
    )
}

ModalComponent.propTypes = {
    open: PropTypes.bool.isRequired,
    token: PropTypes.string,
    setOpen: PropTypes.func,
}

export default ModalComponent
