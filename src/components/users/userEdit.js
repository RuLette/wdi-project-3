import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Auth from '../../lib/auth'
import UserEditMap from '../common/userEditMap'
import UserForm from './userForm'

class UserEdit extends React.Component {
  constructor() {
    super()
    this.state = {
      currentUser: { location: {}},
      errors: {}
    }
    this.mapCenter = {
      lat: 51.5,
      lng: -0.11
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleLocation = this.handleLocation.bind(this)
  }

  handleChange({ target: { name , value }}) {
    console.log(name , value)
    const user = {...this.state.currentUser, [name]: value}
    const errors = {...this.state.errors, [name]: ''}
    this.setState({ errors, currentUser: user })
  }

  handleLocation(location) {
    location = {...this.state.currentUser.location, lat: location.lat, lng: location.lng}
    const currentUser = {...this.state.currentUser, location}
    this.setState({ currentUser })
  }

  handleSubmit(e) {
    e.preventDefault()
    axios.put(`/api/users/${Auth.getPayload().sub}`, this.state.currentUser,
      { headers: { Authorization: `Bearer ${Auth.getToken()}`}})
      .then(() => this.props.history.push('/users'))
      .catch(err => this.setState({errors: err.response.data.errors}))
  }

  getUser() {
    axios.get(`/api/users/${Auth.getPayload().sub}`)
      .then(res => this.setState({  currentUser: res.data }))
      .catch(err => console.log(err))
  }

  componentDidMount() {
    this.getUser()
  }

  render() {
    return(
      <main className="section">
        <div className="columns">
          <UserForm
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            handleLocation={this.handleLocation}
            currentUser={this.state.currentUser}
            mapCenter={this.mapCenter}
            errors={this.state.errors}/>

        </div>

      </main>
    )
  }
}
export default UserEdit