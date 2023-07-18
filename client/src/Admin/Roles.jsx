
import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import Chip from '@mui/joy/Chip';
import Stack from '@mui/material/Stack';
import Navbar from './Navbar';
import { Transition } from 'react-transition-group';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import DownloadIcon from '@mui/icons-material/Download';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { CSVLink } from "react-csv";


const Roles = () => {
    const { id } = useParams();
    const maxLength = 27;
    const { project_id, role_id } = useParams();
    const { projectName } = useParams();
    const [copen, setcOpen] = React.useState(false);
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1);
    const [report1, setreport1] = useState([]);
    const [passengersCount, setPassengersCount] = useState(0);
    const [controller, setController] = useState({
        page: 0,
        rowsPerPage: 5
    });

    const [open, setOpen] = React.useState(false);
    const [userData, setuserData] = useState([])
    const [role, setRole] = useState([])
    const [data, setData] = useState({});
    const [addrole, setaddrole] = useState({
        role_name: ""
    })

    let name, value
    const handleInput = (e) => {
        name = e.target.name
        value = e.target.value
        setaddrole({ ...addrole, [name]: value })
    }




    const addmembersubmitt = async (e) => {
        e.preventDefault()

        const { role_name } = addrole
  
        const res = await fetch(`/addrole/${id}`, {

            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            body: JSON.stringify({ role_name })
        })

        const data = await res.json()



        if (res.status === 422 || !data) {
            toast.error("Please fill The Data Correctly", {
                position: "top-center",
                theme: "colored",

            })
        } else {
            toast.info("Role tagged successfully", {
                position: "top-right",
                theme: "colored"
            })
            setTimeout(() => callAboutPageone(), 500)
        }
    }



    const todownloadreport1 = async () => {
        try {
            const res = await fetch(`/downloadreport1/${project_id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            const result = await res.json();
            console.log(result);
            setreport1(result);

            if (!result || Object.keys(result).length === 0) {
                window.alert("No data is present.");
            }
        } catch (error) {
            console.log(error);
        }
    };






    const callAboutPageone = async () => {
        try {
            const res = await axios.get(`http://localhost:9000/getallroles/${id}`)
            setuserData(res.data)

        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        callAboutPageone()
    }, [controller])

  return (
    <>
    <Navbar/>
    <nav class="navbar admin-nav navbar-expand-lg bg-body-tertiary admin1 ">
                {/* /* data-bs-theme="primary" */}
                <div class="container-fluid">
                    <Chip style={{ marginRight: "5%" }}
                        className="bg-light text-primary "
                        color="neutral"
                        disabled={false}
                        size="md"
                        label="primary"
                        variant="outlined"
                        fontWeight="bold"
                    ><label className='admin1'>Contractor List of {projectName.slice(0, maxLength)}   </label></Chip>
                     <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul style={{ marginRight: "5%" }} class="navbar-nav ms-auto mb-2 mb-lg-0">
                   
                    <li class="nav-item">
                         <CSVLink className="download-report btn btn-light mx-3 text-primary admin1" filename={`${projectName}.csv`} data={report1} ><DownloadIcon /></CSVLink>
                    </li>
                        </ul>
                    </div>
    </div>
    </nav>
      <section id="hero" class="clearfix ">
                <div class="container ">
                    <div class="row" data-aos="fade-up">
                        <div class="col-lg-6  intro-info order-lg-first order-last" data-aos="zoom-in" data-aos-delay="100">
                            <h2>The currently tagged Roles in  <span>{projectName.slice(0, maxLength)}</span></h2>
                            <div className=''>
                                <div className='row'>
                                    <div className='col-sm-3  col-md-3 col-lg-4'>
                                        {/* <Button startDecorator={<Add />}>Add to cart</Button> */}
                                        <a onClick={() => setOpen(true)} style={{ textDecoration: "None" }} href="#about" class="btn-get-started scrollto">Add Roles</a>
                                    </div>
                                    <div className='col-sm-8  col-md-8 col-lg-4'>
                                        {/* <Input
                                            
                                            endDecorator={<Button><SearchIcon/></Button>}
                                            sx={{
                                                "--Input-radius": "18px",
                                                "--Input-gap": "-50px"
                                            }}
                                        /> */}
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="col-lg-6    intro-img order-lg-last order-first" data-aos="zoom-out" data-aos-delay="200">

                            <ol class="list-group list-group-numbered mt-5 shadow-lg">
                                {
                                    userData.map((item, i) => (
                                        <li class="list-group-item d-flex justify-content-between align-items-start">
                                            <div class="ms-2 me-auto">
                                                <NavLink to={`/contractor/${id}/${item.role_id}`}  className="text-decoration-none"><div class="fw-bold">{item.role_name}</div></NavLink>
                                            </div>
                                        </li>


                                    ))}

                            </ol>
                            
                        </div>
                    </div>

                </div>
            </section>


            <Transition in={open} timeout={400}>
                {(state) => (
                    <Modal
                        keepMounted
                        open={!['exited', 'exiting'].includes(state)}
                        onClose={() => setOpen(false)}
                        slotProps={{
                            backdrop: {
                                sx: {
                                    opacity: 0,
                                    backdropFilter: 'none',
                                    transition: `opacity 400ms, backdrop-filter 400ms`,
                                    ...{
                                        entering: { opacity: 1, backdropFilter: 'blur(8px)' },
                                        entered: { opacity: 1, backdropFilter: 'blur(8px)' },
                                    }[state],
                                },
                            },
                        }}
                        sx={{
                            visibility: state === 'exited' ? 'hidden' : 'visible',
                        }}
                    >
                        <ModalDialog
                            aria-labelledby="fade-modal-dialog-title"
                            aria-describedby="fade-modal-dialog-description"
                            sx={{
                                opacity: 0,
                                transition: `opacity 300ms`,
                                ...{
                                    entering: { opacity: 1 },
                                    entered: { opacity: 1 },
                                }[state],
                            }}
                        >
                            <Typography id="fade-modal-dialog-title" component="h2">

                            </Typography>
                            <Typography
                                id="fade-modal-dialog-description"
                                textColor="text.tertiary"
                            >
                                <form method='post'>
                                    <div class="mb-3">
                                        <input type="text"
                                            class="form-control mt-5"
                                            id="exampleInputEmail1"
                                            aria-describedby="emailHelp"
                                            name='role_name'
                                            value={addrole.role_name}
                                            onChange={handleInput}
                                        />
                                        <div id="emailHelp" class="form-text"> Enter Roles to your current project</div>
                                    </div>
                                    <button onClick={(e) => addmembersubmitt(e)} type="submit" class="btn btn-dark tetxt-white">Submit</button>
                                </form>
                            </Typography>
                        </ModalDialog>
                    </Modal>
                )}
            </Transition>
    </>
  )
}

export default Roles