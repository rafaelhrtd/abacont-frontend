import React from 'react';
import Getter from '../../../../helpers/Getter'
import classes from './ProjectIndex.css'
import Search from '../../../../UI/Search/Search'
import { Link } from 'react-router-dom';
import LocalizedStrings from 'react-localization';

class ProjectIndex extends Getter {
    state = {
        projects: [],
        search_projects: []
    }

    strings = () => {
        let strings = new LocalizedStrings({
            en:{
                projects: "Projects",
                search: "Search for a project",
                latestProjects: "Latest Proyects"
            },
            es: {
                projects: "Proyectos",
                search: "Buscar proyecto",
                latestProjects: "Proyectos recientes"
            }
        });
        let language = navigator.language;
        if (localStorage.getItem('language') !== null){
            language = localStorage.getItem('language');
        } else if (sessionStorage.getItem('language') !== null){
            language = sessionStorage.getItem('language');
        }
        return strings;        
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
        const projects = this.state.projects
        
        const latestProjects = projects.length > 0 ? (
            <div className={classes.latestProjects}>
                <div className={classes.title}>
                    <h2>{this.strings().latestProjects}</h2>
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
                <h1>{this.strings().projects}</h1>
                <div className={classes.Search}>
                    <Search 
                        objects={this.state.search_projects}
                        placeholder={this.strings().search}
                        link={searchLink} />
                </div>

                {latestProjects}
            </div>
        )
    }
}

export default ProjectIndex