import React, { Component } from 'react';
import TextInput from './TextInput.jsx';
import Button from './Button.jsx';

export default class LoginForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            login: '',
            password: '',
            active: false,
            error: 'none',
            errorMsg: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event){

        event.preventDefault();
        if (this.state.login === '' || this.state.password === ''){
            return this.errorShake();
        }

        const body = JSON.stringify(this.state);

        fetch(Config.API_HOST + "/sessions", {
            method: "post",
            headers: { "Content-type": "application/json" },
            body
        })
            .then(response => response.json())
            .then(jsonResponse => {
                if (jsonResponse.status !== 200) throw Error(jsonResponse.message);
                return jsonResponse;
            })
            .then(({ token }) => {
                const expires = new Date(new Date().getTime() + 31536000000);
                Cookies.set("user_session", token, { expires });
                window.location.replace("/accounts");
            })
            .catch(error => {

                this.setState({
                    error:'block',
                    errorMsg: error.message,
                });

                this.errorShake();
            });

    }

    handleChange(event){
        const state = this.state;
        state[event.target.name] = event.target.value;
        this.setState(state);

    }

    errorShake() {
        this.setState({active: true})
        setTimeout( () => this.setState({active: false}),1000);
    }

  render() {
    return(
      <div
           className={this.state.active ? 'container shake' : 'container'}
           id="loginContainer"
           onSubmit={this.handleSubmit}
      >
        <div className="card card-default">
          <HeaderForm />
          <BodyForm
              display={this.state.error}
              errorMsg={this.state.errorMsg}
              password={this.state.password}
              login={this.state.login}
              setValue={this.handleChange}
          />
        </div>
      </div>
    )
  }
}


class HeaderForm extends Component {
  render() {
    return (
      <div className="card-header">
        <h4>
          <strong>Вход в админку</strong>
        </h4>
      </div>
    )
  }
}


class BodyForm extends Component {
  render() {
      return (
      <div>
        <div className="card-body">
        <div style={{ display: (this.props.display) }} className="alert alert-danger">
            {this.props.errorMsg}
        </div>
          <form>
              <TextInput
                  type = 'text'
                  label = 'Логин'
                  className = 'form-control'
                  name = 'login'
                  value = {this.props.login}
                  onChange={this.props.setValue}
              />
              <TextInput
                  type = 'password'
                  label = 'Пароль'
                  className = 'form-control'
                  name = 'password'
                  value = {this.props.password}
                  onChange={this.props.setValue}
              />
            <Button
                type='submit'
                btnClass='btn-primary'
                title='Войти'
            />
            </form>
          </div>
      </div>

    )
  }
}
