import React from 'react';
import Getter from '../../../../helpers/Getter'
import classes from './ProjectIndex.css'
import Search from '../../../../UI/Search/Search'
import { Link } from 'react-router-dom'

class ProjectIndex extends Getter {
    state = {
        projects: [],
        search_projects: []
    }


    errorHandler = () => {
        this.setState({commError: true});
    }

    successHandler = (data) => {
        this.setState({
            projects: data.projects,
            search_projects: data.objects
        })
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return(
            JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
                 JSON.stringify(nextState) != JSON.stringify(this.state)
        )
    }

    getProjects = () => {
        let data = {}
        const url = process.env.REACT_APP_API_ADDRESS + "projects/"
        this.getServerInfo(url, data, this.errorHandler, this.successHandler)
    }

    componentDidMount = () => {
        if (!this.state.commError){
            this.getProjects();
        }
    }

    componentDidUpdate = () => {
        if (!this.state.commError){
            this.getProjects();
        }
    }

    render(){

        const placeholder = "proyecto"
        const searchLink = "/proyectos/"
        const title = "Proyectos"
        const projects = this.state.projects
        
        const latestProjects = projects.length > 0 ? (
            <div className={classes.latestProjects}>
                <div className={classes.title}>
                    <h2>Últimos {title}</h2>
                </div>
                {
                    projects.map(project => (
                        <Link to={searchLink + project.id}>
                            <div className={classes.Item}>
                                    <div className={classes.name}>
                                        {project.name}
                                    </div>
                            </div>
                        </Link>

                    ))
                }
            </div>
        ) : null

        return(
            <div className={classes.ProjectIndex}>
                <h1>{title}</h1>
                <div className={classes.Search}>
                    <Search 
                        objects={this.state.search_projects}
                        placeholder={"Buscar " + placeholder}
                        link={searchLink} />
                </div>

                {latestProjects}
            </div>
        )
    }
}

export default ProjectIndex