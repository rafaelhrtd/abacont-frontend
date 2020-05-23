import React from 'react';
import Getter from '../../helpers/Getter';
import Button from '../Buttons/Button/Button';
import classes from './Search.css'

class Search extends Getter {
    state = {
        kind: this.props.kind,
        data: this.props.data,
        objects: [],
        input: "",
        matches: [],
        inputStyle: null,
        id: 0,
        errors: {}
    }

    errorHandler = () => {
        this.setState({commError: true});
    }

    successHandler = (data) => {
        let objects = Object.keys(data.objects).map(obKey => (
            data.objects[obKey]
        ));
        objects.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
        this.setState({objects: objects})
    }
    shouldComponentUpdate = (nextProps, nextState) => {
        return ((this.state.objects === [] && nextState.objects !== []) ||
            this.state.input !== nextState.input || this.state.id !== nextState.id ||
            JSON.stringify(this.state.matches) !== JSON.stringify(nextState.matches)) ||
            JSON.stringify(this.props) !== JSON.stringify(nextProps)
    }
    inputChangeHandler = (event) => {
        this.setState({
            input: event.target.value,
            id: event.target.value.length === 0 ? null : 0,
            matches: this.generateMatches(event.target.value),
            inputStyle: event.target.value.length === 0 ? "" : "Incorrect"
        })
        let data = null
        if (event.target.value.length === 0){
            data = {name: this.props.name, value: ''}
        } else {
            data = {name: this.props.name, value: 0}
        }
    
        this.props.changed(null, data, null, this.props.old_data)

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
    clickedSuggestionHandler = (event, object) => {
        this.setState({
            input: object.name,
            id: object.id, 
            matches: [],
            inputStyle: "Correct"
        });
        const data = {name: this.props.name, value: object.id}
        this.props.changed(null, data)
    }
    selectedOptionHandler = (object) => {
        
    }
    componentDidMount = () => {
        this.setState({
            input: this.props.givenName,
            id: this.props.givenID
        })
    }
    componentDidUpdate = (prevProps) => {
        if (prevProps.givenID !== this.props.givenID){
            this.setState({
                input: this.props.givenName,
                id: this.props.givenID
            })
        }
    }

    render(){
        const url = process.env.REACT_APP_API_ADDRESS + this.props.url   
        if (this.state.objects.length === 0 && !this.state.commError){
            this.getServerInfo(url, this.props.data, this.errorHandler, this.successHandler)
        }
        return(
            <div className={classes.Search}>
                <div className={classes.SearchBar}>
                    <input 
                        type="text" 
                        placeholder={this.props.placeholder}
                        className={[classes[this.state.inputStyle], this.props.className].join(" ")}
                        value = {this.state.input}
                        // only disabled if the ID is given AND edit is not set
                        disabled={this.props.givenID !== undefined && this.props.edit === false}
                        onChange={(event) => {this.inputChangeHandler(event)}} />
                    <input 
                        type="hidden" 
                        name={this.props.name} 
                        value={this.state.id}
                        />
                    <div className={classes.Container}>
                        <div className={classes.Results}>
                            {this.state.matches.map(object => (   
                                <div key={object.id}
                                    className={classes.Result}
                                    onClick={(event) => {
                                        this.clickedSuggestionHandler(event, object)
                                    }}>
                                    {object.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {
                    !(this.props.givenID !== undefined && this.props.edit === false) ? (
                        <Button 
                            className="FormInline" 
                            onClick={() => this.props.clickedAdd(this.props.current_input)}>+</Button>
                    ) : null
                }
            </div>
        )
    }
}

export default Search;