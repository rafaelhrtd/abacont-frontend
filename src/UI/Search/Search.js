import React, {Component} from 'react';
import classes from './Search.css';
import { Link } from 'react-router-dom';
import Button from '../Buttons/Button/Button';
import AuthContext from '../../context/auth-context';

// expected props:
// placeholder: self explanatory
// objects: objects for search to look through
// link: starts the link to take the user there on click
class Search extends Component {
    state = {
        input: "",
        objects: [],
        matches: []
    }
    static contextType = AuthContext;
    shouldComponentUpdate = (nextProps, nextState) => {
        return (
            JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
                 JSON.stringify(nextState) != JSON.stringify(this.state)
        )
    }

    inputChangeHandler = (event) => {
        this.setState({
            input: event.target.value,
            id: event.target.value.length === 0 ? null : 0,
            matches: this.generateMatches(event.target.value),
            inputStyle: event.target.value.length === 0 ? "" : "Incorrect"
        })
        this.setState({matches: this.generateMatches(event.target.value)})
    }
    generateMatches = (text) => {
        const matches = []
        this.state.objects.map( object => {
            if (object.name.toLowerCase().startsWith(text.toLowerCase())
                && text.length > 0 && matches.length <= 4){
                matches.push(object)
            }
            return 0
        })
        return matches
    }

    getLatestObjects = () => {
        this.setState({
            objects: this.props.objects
        })
    }

    componentDidMount = () => {
        this.getLatestObjects()
    }

    componentDidUpdate = () => {
        this.getLatestObjects()
    }

    clickedSuggestionHandler = (event, object) => {
    }

    render(){
        return(
            <div className={classes.Search}>
                <div className={classes.SearchBar}>
                    {/* handles the text input and calls input change handler */}
                    <input 
                        type="text" 
                        placeholder={this.props.placeholder}
                        value = { this.props.givenID !== undefined ? (
                            this.props.placeholder + ": " + this.state.input
                        ) : this.state.input}
                        // only disabled if the ID is given AND edit is not set
                        disabled={this.props.givenID !== undefined && this.props.edit === false}
                        onChange={(event) => {this.inputChangeHandler(event)}} />
                    {/* presents the results from input handler */}
                    <div className={classes.Container}>
                        <div className={classes.Results}>
                            {this.state.matches.map(object => (
                                <Link to={this.props.link + object.id}>
                                    <div key={object.id}
                                        className={classes.Result}>
                                        {object.name}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                { this.context.user.can_write ? (
                    <Link to={this.props.link + "agregar"} className={classes.AddButton}>
                        <Button>+</Button>
                    </Link>
                ) : null}
            </div>
        )
    }
}

export default Search;