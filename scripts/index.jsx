import ReactDOM from 'react-dom';
import React from 'react';

class App extends React.Component {
    render(){
        return (
            <div>
                <h1>Hello React App!</h1>
            </div>
        );
    }
};
ReactDOM.render(<App/>, document.getElementById('react-body'));
