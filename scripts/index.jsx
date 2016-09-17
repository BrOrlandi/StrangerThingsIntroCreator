import 'strangerScript';
import ReactDOM from 'react-dom';
import React from 'react';


class App extends React.Component {
    render(){
        return (
            <div className="STIC">
                <h1 className="intro-title">Stranger Things<br/>Intro Creator</h1>
                <form id="stranger-form">
                    <textarea id="f-logo" rows="2" spellcheck="false" maxlength="100" defaultValue="STRANGER&#13;&#10;THINGS" />
                </form>
            </div>
        );
    }
};
ReactDOM.render(<App/>, document.getElementById('react-body'));
